
import { NextResponse } from "next/server";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

export async function GET() {
  const walletSetId = process.env.WALLET_SET_ID!;
  const res = await client.listWallets({ walletSetId });
  return NextResponse.json(res.data);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const walletSetId = process.env.WALLET_SET_ID!;
  const res = await client.createWallets({
    walletSetId,
    blockchains: ["ARC-TESTNET"],
    count: 1,
    accountType: "EOA",
  });
  return NextResponse.json(res.data);
}
