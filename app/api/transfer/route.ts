
import { NextResponse } from "next/server";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

export async function POST(req: Request) {
  const { walletId, destinationAddress, amount } = await req.json();
  try {
    const tx = await client.createTransaction({
      walletId,
      destinationAddress,
      amounts: [amount],
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    });
    // poll until complete
    let result = tx.data;
    for(let i=0;i<10;i++){
      await new Promise(r=>setTimeout(r, 2000));
      const check = await client.getTransaction({ id: result?.id! });
      result = check.data?.transaction as any;
      if(result?.state === "COMPLETE") break;
    }
    return NextResponse.json(result);
  } catch(e:any){
    return NextResponse.json({ error: e.message, details: e }, { status: 400 });
  }
}
