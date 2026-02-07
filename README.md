# XRPL Dev Platform

A developer platform for the XRP Ledger: create wallets, send payments, manage escrows, and generate SDK code via AI. Uses **XRPL Testnet**.

## Prerequisites

- **Node.js** 18+ (for `fetch` and running the stack)

## Quick Start

### 1. Install dependencies

From the project root:

```bash
cd xrpl-dev-platform
npm run install:all
```

Or install backend and frontend separately:

```bash
cd xrpl-dev-platform/backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment (optional)

For **AI code generation** (Dev Quickstart chat), set your Dedalus Labs API key:

```bash
cp xrpl-dev-platform/backend/.env.example xrpl-dev-platform/backend/.env
```

Edit `xrpl-dev-platform/backend/.env` and set:

```
DEDALUS_API_KEY=your_key_here
```

Get a key at [Dedalus Dashboard](https://www.dedaluslabs.ai/dashboard/api-keys). If you skip this, the rest of the app works; only the AI chat will be disabled.

### 3. Start the application

Open **two terminals**. From the project root, go to `xrpl-dev-platform`.

**Terminal 1 – Backend** (connects to XRPL Testnet, serves API):

```bash
cd xrpl-dev-platform
npm run dev:backend
```

You should see: `Backend running on http://localhost:4000` and `Connected to XRPL Testnet`.

**Terminal 2 – Frontend** (Vite dev server):

```bash
cd xrpl-dev-platform
npm run dev:frontend
```

Then open **http://localhost:3000** (or the port Vite prints) in your browser.

### 4. Use the app

- **Dashboard** – Account overview
- **Wallet** – Create or restore testnet wallets
- **Payments** – Send XRP or RLUSD
- **Escrow** – Create, release, or cancel time-based escrows
- **Dev Quickstart** – SDK snippets, Postman collection download, testnet wallets list, AI chat for generating code

## API

REST API runs at **http://localhost:4000**. The frontend proxies `/api` to the backend when using the app.

- `GET /api/health` – Health check
- `POST /api/wallet/create` – Create funded testnet wallet
- `GET /api/wallet/list` – List wallets created this session
- `GET /api/wallet/balance/:address` – Get balance
- `POST /api/pay` – Send XRP
- `POST /api/escrow/create`, `POST /api/escrow/finish`, `POST /api/escrow/cancel` – Escrow CRUD
- `GET /api/account/info/:address`, `GET /api/account/transactions/:address` – Account info

Import the **Postman collection** from `xrpl-dev-platform/postman/XRPL-Dev-Platform.postman_collection.json`, or download it from the Dev Quickstart page.

## Build for production

```bash
cd xrpl-dev-platform
npm run build:backend
npm run build:frontend
```

Run the backend with:

```bash
cd xrpl-dev-platform/backend && npm start
```

Serve the `xrpl-dev-platform/frontend/dist` folder with any static file server.
