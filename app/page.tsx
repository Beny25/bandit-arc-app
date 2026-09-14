"use client";
import { useState, useEffect } from "react";
export default function Home(){
  const [wallets, setWallets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<Record<string, any>>({});

  const loadWallets = async () => {
    const r = await fetch("/api/wallets");
    const d = await r.json();
    const list = d.data?.wallets || d.wallets || [];
    setWallets(list);
    list.forEach((w:any)=>checkBal(w.id));
  };
  const checkBal = async (id:string) => {
    try {
      const r = await fetch(`/api/balance?walletId=${id}`);
      const d = await r.json();
      const tb = d.data?.tokenBalances || d.tokenBalances || [];
      const arcBal = tb.find((b:any)=> (b.blockchain==="ARC-TESTNET" || b.blockchain==="ARC")) || tb[0];
      setBalances(prev=>({...prev, [id]: arcBal || { amount: "0", token: { symbol: "USDC" } } }));
    } catch {}
  };
  useEffect(()=>{ loadWallets(); }, []);
  const createWallet = async () => {
    setLoading(true);
    await fetch("/api/wallets", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({}) });
    await loadWallets();
    setLoading(false);
  };
  const send = async () => {
    if(!selected) return alert("Pilih wallet!");
    setLoading(true);
    const r = await fetch("/api/transfer", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ walletId: selected.id, destinationAddress: to, amount }) });
    const d = await r.json();
    alert(JSON.stringify(d).slice(0,300));
    checkBal(selected.id);
    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-[#0A0A0B] text-white flex justify-center p-4">
      <div className="w-full max-w-">
        <h1 className="text-center text- font-black mt-4">BANDIT<span className="text-[#FF6B35]">.</span></h1>
        <p className="text-center text- tracking-[0.3em] text-white/30 mb-6">BANDIT.BASE.ETH • ARC TESTNET</p>
        <div className="rounded- bg-white/[0.06] border border-white/[0.08] overflow-hidden">
          <div className="p-5">
            <div className="flex justify-between mb-3"><span className="text- text-white/40">DEV WALLETS • {wallets.length}</span><a href="https://faucet.circle.com/" target="_blank" className="text- px-3 py-1 rounded-full bg-white text-black font-bold">Faucet ↗️</a></div>
            <button onClick={createWallet} disabled={loading} className="w-full h-10 rounded-full bg-[#FF6B35] text-black font-bold text- mb-3">+ Create Wallet</button>
            <div className="space-y-2">
              {wallets.map((w:any)=>{
                const b = balances[w.id];
                return(
                  <div key={w.id} className={`p-3 rounded- border flex justify-between items-center ${selected?.id===w.id? "border-[#FF6B35] bg-[#FF6B35]/10" : "border-white/10 bg-black/40"}`}>
                    <div><div className="font-mono text-">{w.address?.slice(0,6)}...{w.address?.slice(-4)}</div><div className="text- text-white/50">Bal: {b? `${b.amount} ${b.token?.symbol || "USDC"}` : "loading..."} • ARC</div></div>
                    <button onClick={()=>{setSelected(w); checkBal(w.id);}} className={`h-8 px-4 rounded-full text- font-bold ${selected?.id===w.id? "bg-[#FF6B35] text-black" : "bg-white text-black"}`}>{selected?.id===w.id? "✓" : "Select"}</button>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="p-5 border-t border-white/10 bg-[#FF6B35]/[0.03]">
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="To 0x..." className="w-full h-11 rounded-full bg-black/60 border border-white/10 px-5 text- mb-2 outline-none" />
            <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="1" className="w-full h-11 rounded-full bg-black/60 border border-white/10 px-5 text- mb-3 outline-none" />
            <button onClick={send} disabled={!selected||loading} className="w-full h-12 rounded-full bg-white text-black font-black disabled:opacity-30">Send {amount} USDC →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
