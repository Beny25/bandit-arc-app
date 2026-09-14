// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletId, destinationAddress, amount, tokenId } = await req.json();
    return NextResponse.json({ 
      success: true, 
      txId: "mock_tx_" + Date.now(),
      walletId,
      destinationAddress,
      amount,
      tokenId: tokenId || "arc-usdc",
      message: "Transfer initiated" 
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
