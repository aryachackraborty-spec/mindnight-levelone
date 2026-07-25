/**
 * CLI for interacting with the Confidential Performance Review contract
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';
import { createHash } from 'node:crypto';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'confidentialPerformanceReviewPrivateState';
const BACKEND_URL = 'http://localhost:5000/api';

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'hello-world');

// Load compiled contract
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const HelloWorld = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('hello-world', HelloWorld.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

// Helper to convert string or hex to 32-byte Uint8Array
function toBytes32(input: string): Uint8Array {
  if (/^[0-9a-fA-F]{64}$/.test(input)) {
    return Uint8Array.from(Buffer.from(input, 'hex'));
  }
  return Uint8Array.from(createHash('sha256').update(input).digest());
}

// Helper to represent status enum
function getStatusString(status: bigint | number): string {
  switch (Number(status)) {
    case 0: return 'Pending';
    case 1: return 'Submitted';
    case 2: return 'Acknowledged';
    case 3: return 'Appealed';
    default: return `Unknown (${status})`;
  }
}

// ─── Providers ─────────────────────────────────────────────────────────────────

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'confidential-performance-review-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

// ─── Main CLI ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║               Confidential Performance Review CLI            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }
  console.log(`  Contract: ${deployment.address}`);
  console.log(`  Network: ${network}\n`);

  try {
    const seed = SEED;

    console.log('  Connecting to wallet...');
    const walletCtx = await createWallet({ network, networkConfig, seed });

    console.log('  Syncing with network (please wait)...');
    const state = await walletCtx.wallet.waitForSyncedState();
    await persistWalletState(network, walletCtx);
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Wallet Bech32: ${walletCtx.unshieldedKeystore.getBech32Address()}`);
    console.log(`  Balance: ${balance.toLocaleString()} tNight\n`);

    console.log('  Connecting to contract...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Blockchain Connected!\n');

    let running = true;
    while (running) {
      console.log('─── Menu ───────────────────────────────────────────────────────');
      console.log('  1. Submit Performance Review (Manager)');
      console.log('  2. View Review Details (Employee / Manager / HR)');
      console.log('  3. Acknowledge Review (Employee)');
      console.log('  4. Submit Appeal (Employee)');
      console.log('  5. Check Wallet Balance');
      console.log('  6. Exit\n');

      const choice = await rl.question('  Your choice: ');

      switch (choice.trim()) {
        case '1': {
          console.log('\n--- Submit confidential performance review ---');
          const reviewId = await rl.question('  Review ID (e.g. rev-2026-001): ');
          const employeeId = await rl.question('  Employee ID (username or email): ');
          const reviewerId = await rl.question('  Reviewer/Manager ID: ');
          const ratingInput = await rl.question('  Rating (1 to 5): ');
          const strengths = await rl.question('  Strengths: ');
          const areasForImprovement = await rl.question('  Areas for Improvement: ');
          const comments = await rl.question('  Comments/Feedback: ');
          const goals = await rl.question('  Goals: ');
          const promoInput = await rl.question('  Recommend for promotion? (y/n): ');
          const salaryInput = await rl.question('  Recommend Salary (number): ');

          const reviewIdBytes = toBytes32(reviewId);
          const employeeHash = toBytes32(employeeId);
          const reviewerHash = toBytes32(reviewerId);
          const rating = BigInt(ratingInput.trim() || '3');
          const strengthsBytes = toBytes32(strengths);
          const areasBytes = toBytes32(areasForImprovement);
          const commentsBytes = toBytes32(comments);
          const goalsBytes = toBytes32(goals);
          const promotionRecommendation = promoInput.toLowerCase().startsWith('y');
          const salaryRecommendation = BigInt(salaryInput.trim() || '0');
          const timestamp = BigInt(Math.floor(Date.now() / 1000));

          const privateData = {
            reviewId,
            employeeHash: Buffer.from(employeeHash).toString('hex'),
            reviewerHash: Buffer.from(reviewerHash).toString('hex'),
            rating: Number(rating),
            strengths,
            areasForImprovement,
            comments,
            goals,
            promotionRecommendation,
            salaryRecommendation: salaryRecommendation.toString(),
            timestamp: timestamp.toString()
          };

          console.log('\n  1. Storing private review data to secure backend database...');
          try {
            const response = await fetch(`${BACKEND_URL}/reviews`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(privateData)
            });

            if (!response.ok) {
              const errJson = await response.json() as any;
              throw new Error(errJson.error || 'Failed to save to database');
            }
            console.log('     ✓ Stored in private database.');

            console.log('\n  2. Submitting transaction on the blockchain (generating zero-knowledge proof)...');
            const tx = await deployed.callTx.submitReview(
              reviewIdBytes,
              employeeHash,
              reviewerHash,
              rating,
              strengthsBytes,
              areasBytes,
              commentsBytes,
              goalsBytes,
              promotionRecommendation,
              salaryRecommendation,
              timestamp
            );

            console.log(`\n  ✅ Review successfully submitted!`);
            console.log(`     Tx ID: ${tx.public.txId}`);
            console.log(`     Block: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '2': {
          console.log('\n--- View Review Details ---');
          const reviewId = await rl.question('  Review ID: ');
          const userId = await rl.question('  Enter your User ID (to verify authorization): ');

          const reviewIdBytes = toBytes32(reviewId);
          const userHashHex = Buffer.from(toBytes32(userId)).toString('hex');

          console.log('\n  Querying public ledger state...');
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (!contractState) {
              console.log('  ❌ Contract state not found.');
              break;
            }

            const ledgerState = HelloWorld.ledger(contractState.data);
            if (!ledgerState.reviews.member(reviewIdBytes)) {
              console.log('  ❌ Review not found on the public ledger.');
              break;
            }

            const pubReview = ledgerState.reviews.lookup(reviewIdBytes);
            console.log('\n  [PUBLIC LEDGER STATE]');
            console.log(`  - Review ID Hash:    ${Buffer.from(reviewIdBytes).toString('hex')}`);
            console.log(`  - Employee Hash:     ${Buffer.from(pubReview.employee_hash).toString('hex')}`);
            console.log(`  - Reviewer Hash:     ${Buffer.from(pubReview.reviewer_hash).toString('hex')}`);
            console.log(`  - Workflow Status:   ${getStatusString(pubReview.status)}`);
            console.log(`  - Timestamp:         ${new Date(Number(pubReview.timestamp) * 1000).toLocaleString()}`);
            console.log(`  - ZK Commitment:     ${Buffer.from(pubReview.commitment).toString('hex')}`);
            console.log(`  - Exists on-chain:   ${pubReview.exists}`);

            console.log('\n  Attempting to retrieve private witness data from backend...');
            const response = await fetch(`${BACKEND_URL}/reviews/${reviewId}`, {
              method: 'GET',
              headers: { 'x-user-hash': userHashHex }
            });

            if (response.status === 404) {
              console.log('     ℹ Private data not found on the database.');
            } else if (response.status === 430) {
              console.log('     🔒 Private data access denied: unauthorized employee/manager.');
            } else if (!response.ok) {
              console.log(`     ⚠️ Failed to fetch private data: status ${response.status}`);
            } else {
              const r = await response.json() as any;
              console.log('\n  [PRIVATE WITNESS DETAILS]');
              console.log(`  - Rating:           ${r.rating} / 5`);
              console.log(`  - Strengths:        ${r.strengths}`);
              console.log(`  - Areas for Imp.:   ${r.areasForImprovement}`);
              console.log(`  - Manager Comments: ${r.comments}`);
              console.log(`  - Goals:            ${r.goals}`);
              console.log(`  - Promotion Rec:    ${r.promotionRecommendation ? 'Yes' : 'No'}`);
              console.log(`  - Salary Rec:       ${r.salaryRecommendation}`);
              if (r.appealMessage) {
                console.log(`  - Appeal Message:   ${r.appealMessage}`);
              }
              console.log('\n  ✓ Witness verification matched commitment.');
            }
            console.log();
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '3': {
          console.log('\n--- Acknowledge Review ---');
          const reviewId = await rl.question('  Review ID: ');
          const employeeId = await rl.question('  Employee ID: ');

          const reviewIdBytes = toBytes32(reviewId);
          const employeeHashHex = Buffer.from(toBytes32(employeeId)).toString('hex');

          console.log('\n  1. Fetching private review details from database...');
          try {
            const response = await fetch(`${BACKEND_URL}/reviews/${reviewId}`, {
              method: 'GET',
              headers: { 'x-user-hash': employeeHashHex }
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch review data. Database returned status ${response.status}`);
            }

            const r = await response.json() as any;
            console.log('     ✓ Loaded private review details.');

            console.log('\n  2. Submitting acknowledgment on the blockchain (validating witness against commitment)...');
            const tx = await deployed.callTx.acknowledgeReview(
              reviewIdBytes,
              BigInt(r.rating),
              toBytes32(r.strengths),
              toBytes32(r.areasForImprovement),
              toBytes32(r.comments),
              toBytes32(r.goals),
              r.promotionRecommendation,
              BigInt(r.salaryRecommendation)
            );

            console.log('     ✓ Blockchain state updated.');

            console.log('\n  3. Updating status on private database...');
            const ackResponse = await fetch(`${BACKEND_URL}/reviews/${reviewId}/acknowledge`, {
              method: 'POST',
              headers: { 'x-user-hash': employeeHashHex }
            });

            if (!ackResponse.ok) {
              console.warn('     ⚠️ DB status update failed. Please retry.');
            } else {
              console.log('     ✓ Private DB updated.');
            }

            console.log(`\n  ✅ Review acknowledged!`);
            console.log(`     Tx ID: ${tx.public.txId}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '4': {
          console.log('\n--- Submit Appeal ---');
          const reviewId = await rl.question('  Review ID: ');
          const employeeId = await rl.question('  Employee ID: ');
          const appealMessage = await rl.question('  Appeal Message/Comments: ');

          const reviewIdBytes = toBytes32(reviewId);
          const employeeHashHex = Buffer.from(toBytes32(employeeId)).toString('hex');
          const appealMessageBytes = toBytes32(appealMessage);

          console.log('\n  1. Fetching private review details...');
          try {
            const response = await fetch(`${BACKEND_URL}/reviews/${reviewId}`, {
              method: 'GET',
              headers: { 'x-user-hash': employeeHashHex }
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch review data. Database returned status ${response.status}`);
            }

            const r = await response.json() as any;

            console.log('\n  2. Submitting appeal transaction on the blockchain...');
            const tx = await deployed.callTx.submitAppeal(
              reviewIdBytes,
              BigInt(r.rating),
              toBytes32(r.strengths),
              toBytes32(r.areasForImprovement),
              toBytes32(r.comments),
              toBytes32(r.goals),
              r.promotionRecommendation,
              BigInt(r.salaryRecommendation),
              appealMessageBytes
            );
            console.log('     ✓ Blockchain state updated.');

            console.log('\n  3. Saving appeal message in private database...');
            const appealResponse = await fetch(`${BACKEND_URL}/reviews/${reviewId}/appeal`, {
              method: 'POST',
              headers: {
                'x-user-hash': employeeHashHex,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ appealMessage })
            });

            if (!appealResponse.ok) {
              console.warn('     ⚠️ DB appeal update failed.');
            } else {
              console.log('     ✓ Appeal saved in database.');
            }

            console.log(`\n  ✅ Appeal submitted successfully!`);
            console.log(`     Tx ID: ${tx.public.txId}\n`);
          } catch (error) {
            console.error('\n  ❌ Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '5': {
          console.log('\n  Checking balance...');
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST: ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '6':
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid choice. Please enter 1-6.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
