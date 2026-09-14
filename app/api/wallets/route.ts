// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing CIRCLE_API_KEY env" }, { status: 500 });

    // Create wallet via Circle API directly (no SDK type issue)
    const walletSetId = process.env.WALLET_SET_ID;

    const res = await fetch("https://api.circle.com/v1/w3s/developer/wallets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        walletSetId: walletSetId,
        blockchains: ["ARC-TESTNET"],
        count: 1,
        accountType: "EOA"
      })
    });

    const data = await res.json();
    if (!res.ok) {
      // Fallback mock if ARC-TESTNET not supported yet on that API version, try ARC
      const res2 = await fetch("https://api.circle.com/v1/w3s/developer/wallets", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ walletSetId, blockchains: ["ARC"], count: 1, accountType: "EOA" })
      });
      const data2 = await res2.json();
      return NextResponse.json(data2);
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const apiKey = process.env.CIRCLE_API_KEY;
    const walletSetId = process.env.WALLET_SET_ID;
    if (!apiKey) return NextResponse.json({ wallets: [] });

    const res = await fetch(`https://api.circle.com/v1/w3s/wallets?walletSetId=${walletSetId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ wallets: [] });
  }
}
