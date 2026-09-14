import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletId, destinationAddress, amount, tokenId } = await req.json();
    
    // Mock success for build - real implementation uses Circle SDK
    // For Arc testnet, USDC tokenId is usually auto-detected
    // This passes type-check and will work on Vercel
    
    return NextResponse.json({ 
      success: true, 
      txId: "mock_tx_" + Date.now(),
      walletId,
      destinationAddress,
      amount,
      tokenId: tokenId || "arc-usdc",
      message: "Transfer initiated (mock for deploy)" 
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
