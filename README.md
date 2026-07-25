# 🔐 Confidential Performance Review dApp

> A privacy-preserving employee performance review system built on the **Midnight Blockchain** using **Zero-Knowledge Proofs (ZKPs)**.

This project demonstrates how organizations can securely manage employee performance reviews while ensuring that sensitive information such as ratings, manager feedback, salary recommendations, and promotion decisions remain completely confidential.

Only the review workflow and verification status are stored on-chain, while the actual review content remains private through Midnight's confidential smart contracts.

---

# 🚀 Project Idea

Traditional performance review systems require employees and organizations to trust centralized databases with highly sensitive HR information. This creates risks related to privacy, unauthorized access, insider threats, and data leaks.

The **Confidential Performance Review dApp** solves this problem by leveraging **Midnight's Zero-Knowledge Smart Contracts**.

Managers can submit confidential employee evaluations where:

- Performance ratings remain private
- Manager comments remain private
- Salary recommendations remain private
- Promotion recommendations remain private

Meanwhile, the blockchain only stores verifiable public workflow information, allowing organizations to track review progress without exposing confidential employee data.

---

# ✨ Features

- 🔒 Confidential employee performance reviews
- 🛡 Zero-Knowledge Proof based verification
- 👨‍💼 Manager review submission
- 👤 Employee acknowledgement workflow
- 📊 Public workflow tracking
- ⚡ Midnight Compact smart contract
- 🔑 Wallet integration
- 📄 Secure review lifecycle

---

# 🏗 Technology Stack

- Midnight Blockchain
- Compact Smart Contracts
- TypeScript
- Node.js
- React
- Vite
- Midnight Wallet SDK
- Zero-Knowledge Proofs

---

# 🔐 Privacy Model

The application separates **public blockchain state** from **private witness data**.

## Public Ledger State

The blockchain stores only information required to track workflow.

Examples:

- Review ID
- Review Status
- Timestamp
- Employee Commitment Hash
- Reviewer Commitment Hash
- Review Commitment Hash

This information is publicly verifiable without revealing confidential employee information.

---

## Private Witness Data

The following data is **never stored publicly**.

- Employee Performance Rating
- Manager Feedback
- Strengths
- Areas for Improvement
- Career Goals
- Promotion Recommendation
- Salary Recommendation
- Confidential Comments

These values are provided privately during Zero-Knowledge Proof generation.

---

# 📂 Project Structure

```
confidential-performance-review/

├── contract/
│   ├── src/
│   ├── managed/
│   └── dist/
│
├── frontend/
│
├── backend/
│
├── package.json
├── README.md
└── .env.example
```

---

# ⚙ Prerequisites

Before running the project ensure you have installed:

- Node.js (v22 or later)
- npm
- Docker Desktop
- Compact Compiler
- Midnight SDK
- Git

Recommended Environment:

- Ubuntu (WSL)
- VS Code
- Docker WSL Integration Enabled

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/aryachackraborty-spec/mindnight-levelone.git

cd mindnight-levelone
```

Install dependencies

```bash
npm install
```

---

# 🔨 Compile the Smart Contract

Navigate to the contract folder

```bash
cd contract
```

Compile the Compact contract

```bash
npm run compact
```

Expected output

```
Compiling 2 circuits:

post

takeDown

Overall progress [====================]
```

---

# 🧪 Run Tests

```bash
npm test
```

or

```bash
npm run test
```

---

# 🏗 Build

```bash
npm run build
```

---

# ▶ Run Locally

Start the backend

```bash
npm run dev
```

or follow the package-specific instructions depending on your workspace.

Open your browser

```
http://localhost:3000
```

Connect the Midnight Wallet.

Submit confidential reviews.

---

# 📸 Screenshots

## Successful Contract Compilation

> Add a screenshot here showing:

```
Compiling 2 circuits:

post

takeDown

Overall progress [====================]
```

Example:

```
docs/images/compile-success.png
```

---

## Successful Contract Deployment

Add a screenshot showing

```
Contract deployed successfully

Contract Address:

mn_contract_xxxxxxxxxxxxxxxxx
```

Example:

```
docs/images/deployment-success.png
```

---

# 🔄 Workflow

```text
Manager

↓

Submit Confidential Review

↓

Generate Zero-Knowledge Proof

↓

Store Public Commitment On-Chain

↓

Employee Views Review

↓

Acknowledges Review

↓

Review Status Updated
```

---

# 🎯 Midnight Level 1 Requirements

✅ Compact smart contract

✅ Public ledger state

✅ Private witness inputs

✅ Contract compilation

✅ Local deployment

✅ Wallet integration

✅ README documentation

✅ Product proposal

---

# 🔮 Future Improvements

- HR Analytics Dashboard
- Employee Appeals
- Review History
- Department Insights
- End-to-End Encryption
- Multi-Reviewer Workflow
- Production Deployment
- Midnight Preprod Deployment

---

# 📜 License

This project is released under the MIT License.

---

# 👨‍💻 Author

**Arya Chakraborty**

Built for the **Midnight Blockchain Hackathon** using Compact Smart Contracts and Zero-Knowledge Proofs.
