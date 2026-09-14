
import { NextResponse } from "next/server";
import { createPublicClient, http, formatUnits } from "viem";
import { defineChain } from "viem";

const arc = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
});

const client = createPublicClient({ chain: arc, transport: http() });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") as any;
  if(!address) return NextResponse.json({ formatted: "0" });
  const balance = await client.getBalance({ address });
  // Arc returns 18 decimals but USDC is 6, so format 18 then handle
  const raw18 = formatUnits(balance, 18);
  // Convert 18 dec -> 6 dec display: if raw is 0.000001 => 1 USDC in 6 dec world
  // Simplest: display raw18 * 1e6? Actually 1 USDC = 1e18 wei on Arc RPC
  // So 1 USDC = formatUnits 18 = "1"
  return NextResponse.json({ formatted: raw18, raw: balance.toString() });
}
