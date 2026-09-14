// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletId, destinationAddress, amount } = await req.json();
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing CIRCLE_API_KEY" }, { status: 500 });

    // For now return real structure - user can fill tokenId later
    const res = await fetch("https://api.circle.com/v1/w3s/developer/transactions/transfer", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        walletId,
        destinationAddress,
        amount: [amount],
        fee: { type: "level", config: { feeLevel: "MEDIUM" } }
      })
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
