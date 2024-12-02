# dVote.h

A decentralized voting system built on Hedera Hashgraph for secure and transparent elections.

## Overview

dVote.h is a decentralized voting application leveraging Hedera Hashgraph's distributed ledger technology. Built with NestJS and TypeScript, it provides a robust backend infrastructure for managing secure and transparent elections.

## 🚀 Features

- Secure voter authentication
- Real-time vote tracking
- Encrypted ballot storage
- Vote verification system
- Multiple election support
- Administrative dashboard
- Real-time results tabulation

## 🛠️ Tech Stack

- **Runtime**: Node.js v23.3.0
- **Backend Framework**: NestJS
- **Language**: TypeScript
- **Blockchain**: Hedera Hashgraph
- **Database**: PostgreSQL

## 🏗️ Architecture

- Decentralized voting system
- Real-time vote tracking
- Secure voter authentication
- Encrypted vote storage
- Admin dashboard for result management

## 🔧 Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/dvote-h.git
cd dvote-h
```

2. Set up Node.js version

```bash
nvm use
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables

```bash
cp .env.example .env
```

5. Run the development server

```bash
npm run start:dev
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dvote_h
DB_USER=postgres
DB_PASSWORD=your_password

# Hedera
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=your_account_id
HEDERA_PRIVATE_KEY=your_private_key
```

## 🚗 API Routes

Documentation coming soon...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

All Rights Reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution,
or use of this software is strictly prohibited. No part of this software may be reproduced,
distributed, or transmitted in any form or by any means without the prior written permission
of the copyright holder.

© 2024 MinkovBrothers LTD . All rights reserved.
