import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createHash } from 'node:crypto';

// Replicate hashing logic used in client/CLI
function toBytes32(input: string): Uint8Array {
  if (/^[0-9a-fA-F]{64}$/.test(input)) {
    return Uint8Array.from(Buffer.from(input, 'hex'));
  }
  return Uint8Array.from(createHash('sha256').update(input).digest());
}

// Simple in-memory mock database to simulate Express backend
class MockBackendDb {
  private db: Record<string, any> = {};

  saveReview(review: any) {
    if (this.db[review.reviewId]) {
      throw new Error('Review already exists');
    }
    this.db[review.reviewId] = { ...review, status: 1 };
  }

  getReview(reviewId: string, userHash: string): any {
    const review = this.db[reviewId];
    if (!review) return null;
    if (review.employeeHash !== userHash && review.reviewerHash !== userHash) {
      throw new Error('Unauthorized');
    }
    return review;
  }

  acknowledge(reviewId: string, userHash: string) {
    const review = this.getReview(reviewId, userHash);
    if (!review) throw new Error('Not found');
    if (review.employeeHash !== userHash) throw new Error('Unauthorized');
    review.status = 2;
  }

  appeal(reviewId: string, userHash: string, msg: string) {
    const review = this.getReview(reviewId, userHash);
    if (!review) throw new Error('Not found');
    if (review.employeeHash !== userHash) throw new Error('Unauthorized');
    review.status = 3;
    review.appealMessage = msg;
  }
}

describe('Confidential Performance Review Tests', () => {

  // Test 1: Hashing helper logic
  test('hashing helper logic is deterministic', () => {
    const id1 = 'rev-1';
    const id2 = 'rev-1';
    const hash1 = toBytes32(id1);
    const hash2 = toBytes32(id2);

    assert.strictEqual(hash1.length, 32);
    assert.deepStrictEqual(hash1, hash2);

    // Test hex string parsing
    const hexStr = 'a'.repeat(64);
    const parsed = toBytes32(hexStr);
    assert.strictEqual(Buffer.from(parsed).toString('hex'), hexStr);
  });

  // Test 2: Review submission workflow rules
  test('review submission flow & validation in private database', () => {
    const db = new MockBackendDb();
    const managerHash = Buffer.from(toBytes32('manager-1')).toString('hex');
    const employeeHash = Buffer.from(toBytes32('employee-1')).toString('hex');

    const review = {
      reviewId: 'rev-2026-01',
      employeeHash,
      reviewerHash: managerHash,
      rating: 5,
      strengths: 'ZKP and cryptography expertise',
      areasForImprovement: 'None',
      comments: 'Excellent performance throughout the quarter',
      goals: 'Lead the next mainnet migration project',
      promotionRecommendation: true,
      salaryRecommendation: '150000'
    };

    db.saveReview(review);

    // Retrieve as manager
    const fetchedByManager = db.getReview('rev-2026-01', managerHash);
    assert.ok(fetchedByManager);
    assert.strictEqual(fetchedByManager.rating, 5);
    assert.strictEqual(fetchedByManager.status, 1); // Status = 1 (Submitted)

    // Retrieve as employee
    const fetchedByEmployee = db.getReview('rev-2026-01', employeeHash);
    assert.ok(fetchedByEmployee);
    assert.strictEqual(fetchedByEmployee.status, 1);
  });

  // Test 3: Access control restrictions
  test('privacy access control checks prevent unauthorized viewing', () => {
    const db = new MockBackendDb();
    const managerHash = Buffer.from(toBytes32('manager-1')).toString('hex');
    const employeeHash = Buffer.from(toBytes32('employee-1')).toString('hex');
    const attackerHash = Buffer.from(toBytes32('attacker-x')).toString('hex');

    const review = {
      reviewId: 'rev-2026-01',
      employeeHash,
      reviewerHash: managerHash,
      rating: 4,
      strengths: 'Coding speed',
      areasForImprovement: 'Documentation',
      comments: 'Good progress',
      goals: 'Write more unit tests',
      promotionRecommendation: false,
      salaryRecommendation: '90000'
    };

    db.saveReview(review);

    // Attacker tries to read
    assert.throws(() => {
      db.getReview('rev-2026-01', attackerHash);
    }, /Unauthorized/);
  });

  // Test 4: Acknowledgment workflow rule state transitions
  test('review acknowledgment transitions status to Acknowledged', () => {
    const db = new MockBackendDb();
    const managerHash = Buffer.from(toBytes32('manager-1')).toString('hex');
    const employeeHash = Buffer.from(toBytes32('employee-1')).toString('hex');

    const review = {
      reviewId: 'rev-002',
      employeeHash,
      reviewerHash: managerHash,
      rating: 3,
      strengths: 'Teamwork',
      areasForImprovement: 'Punctuality',
      comments: 'Solid contributor',
      goals: 'Show up on time',
      promotionRecommendation: false,
      salaryRecommendation: '80000'
    };

    db.saveReview(review);

    // Acknowledge as employee
    db.acknowledge('rev-002', employeeHash);

    const fetched = db.getReview('rev-002', employeeHash);
    assert.strictEqual(fetched.status, 2); // 2 = Acknowledged
  });

  // Test 5: Appeal flow transition
  test('appeal transitions status to Appealed and saves message', () => {
    const db = new MockBackendDb();
    const managerHash = Buffer.from(toBytes32('manager-1')).toString('hex');
    const employeeHash = Buffer.from(toBytes32('employee-1')).toString('hex');

    const review = {
      reviewId: 'rev-003',
      employeeHash,
      reviewerHash: managerHash,
      rating: 2,
      strengths: 'None',
      areasForImprovement: 'All',
      comments: 'Unsatisfactory performance',
      goals: 'Improve immediately',
      promotionRecommendation: false,
      salaryRecommendation: '50000'
    };

    db.saveReview(review);

    // Employee acknowledges first
    db.acknowledge('rev-003', employeeHash);

    // Employee appeals
    const appealMsg = 'I disagree with this review. My goals were met.';
    db.appeal('rev-003', employeeHash, appealMsg);

    const fetched = db.getReview('rev-003', employeeHash);
    assert.strictEqual(fetched.status, 3); // 3 = Appealed
    assert.strictEqual(fetched.appealMessage, appealMsg);
  });
});
