// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletId = searchParams.get("walletId");
    if (!walletId) return NextResponse.json({ error: "need walletId" }, { status: 400 });

    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) return NextResponse.json({ tokenBalances: [] });

    // Real Circle W3S balance endpoint
    const res = await fetch(`https://api.circle.com/v1/w3s/wallets/${walletId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const data = await res.json();

    // data.data.tokenBalances contains USDC balance on ARC-TESTNET
    return NextResponse.json(data);
  } catch (e:any) {
    return NextResponse.json({ tokenBalances: [], error: e.message });
  }
}
