// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Mock wallet creation for deploy success
    return NextResponse.json({
      success: true,
      walletId: "wallet_" + Date.now(),
      address: "0x" + "bandit".padEnd(40, "0"),
      blockchain: "ARC-TESTNET",
      ...body
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ wallets: [] });
}
