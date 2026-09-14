# Bandit Arc Mini App - Full SDK Version

Repo ini **udah include SDK** di package.json, jadi aman deploy ke Vercel tanpa install manual.

## Stack
- Next.js 14 + Tailwind
- @circle-fin/developer-controlled-wallets (full SDK) - di package.json
- viem - buat read-only balance & import
- Arc Testnet RPC: https://rpc.testnet.arc.network

## Fitur
1. **Create Wallet**: bikin dev-controlled wallet baru di ARC-TESTNET (butuh SDK backend)
2. **Import Wallet**: paste address apa aja, cek balance via RPC (tanpa SDK, read-only)
3. **Faucet Button**: auto-copy address + buka https://faucet.circle.com - tinggal paste
4. **Transfer**: USDC native transfer antar wallet

## Cara Jalanin Lokal
```bash
npm install   # otomatis install SDK juga
cp .env.example .env.local
# isi .env.local:
# CIRCLE_API_KEY=...
# CIRCLE_ENTITY_SECRET=...
# WALLET_SET_ID=dd98f7cc-c179-550a-854c-032cf2e51143
npm run dev
```

## Deploy Vercel (Aman)
1. Push ke GitHub
2. Vercel -> New Project -> Import repo
3. Settings -> Environment Variables:
   - CIRCLE_API_KEY
   - CIRCLE_ENTITY_SECRET
   - WALLET_SET_ID
4. Deploy - Vercel akan `npm install` otomatis include SDK

## Kenapa Aman?
- SDK cuma jalan di `/app/api/*` (server side). Secret tidak pernah ke-expose ke client.
- Frontend cuma manggil `/api/wallets` dan `/api/transfer`.
- `CIRCLE_ENTITY_SECRET` tetap di server.

## Flow Faucet yang lu minta
User Create -> klik Faucet 💧 -> address ke-copy + buka faucet.circle.com -> user paste -> dapet 20 USDC -> balik ke app -> balance update.

User Import -> paste address MetaMask dia -> klik Copy & Faucet -> address dia ke-copy -> buka faucet -> dapet USDC buat test.
