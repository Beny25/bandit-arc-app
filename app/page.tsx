"use client";
import { useState, useEffect } from "react";

export default function Home(){
  const [wallets, setWallets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<Record<string, string>>({});

  const loadWallets = async () => {
    const r = await fetch("/api/wallets");
    const d = await r.json();
    const list = d.data?.wallets || d.wallets || [];
    setWallets(list);
    list.forEach((w:any)=>checkBalance(w.id));
  };

  const checkBalance = async (walletId: string) => {
    try {
      const r = await fetch(`/api/balance?walletId=${walletId}`);
      const d = await r.json();
      const bal = d.data?.tokenBalances?.[0]?.amount || d.balances?.[0]?.amount || "0";
      setBalances(prev=>({...prev, [walletId]: bal}));
    } catch { setBalances(prev=>({...prev, [walletId]: "0"})); }
  };

  useEffect(()=>{ loadWallets(); }, []);

  const createWallet = async () => {
    setLoading(true);
    const r = await fetch("/api/wallets", { method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({}) });
    await r.json();
    await loadWallets();
    setLoading(false);
  };

  const send = async () => {
    if(!selected) return alert("Pilih wallet dulu bro!");
    setLoading(true);
    const r = await fetch("/api/transfer", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ walletId: selected.id, destinationAddress: to, amount }) });
    const d = await r.json();
    alert(JSON.stringify(d).slice(0,200));
    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w- h- bg-[#FF6B35]/20 blur- rounded-full" />
      <div className="w-full max-w- relative">
        <div className="text-center mb-6">
          <h1 className="text- font-black tracking-tighter">BANDIT<span className="text-[#FF6B35]">.</span></h1>
          <div className="mt-2 text- tracking-[0.3em] text-white/30">BANDIT.BASE.ETH • ARC TESTNET</div>
        </div>

        <div className="rounded- bg-white/[0.07] border border-white/[0.08] backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(255,107,53,0.15)]">
          <div className="p-6">
            <div className="flex justify-between mb-4"><span className="text- tracking-widest text-white/40">DEV WALLETS • {wallets.length}</span><div className="flex gap-2"><a href="https://faucet.circle.com/" target="_blank" className="text- px-3 py-1 rounded-full bg-white text-black font-bold">Faucet ↗</a><button onClick={loadWallets} className="text- px-3 py-1 rounded-full bg-white/[0.08]">Refresh</button></div></div>

            <button onClick={createWallet} disabled={loading} className="w-full h-11 rounded-full bg-[#FF6B35] text-black font-bold text- mb-4">+ Create Wallet</button>

            <div className="space-y-2.5">
              {wallets.map((w:any)=>(
                <div key={w.id} className={`group p-3.5 rounded- border transition-all ${selected?.id===w.id? "bg-[#FF6B35]/10 border-[#FF6B35]/50" : "bg-black/40 border-white/[0.06] hover:border-white/10"}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-mono text- text-white/90">{w.address?.slice(0,6)}...{w.address?.slice(-4)}</div>
                      <div className="text- text-white/40 mt-1">Bal: {balances[w.id] || "loading..."} USDC • {w.blockchain || "ARC-TESTNET"}</div>
                    </div>
                    <button onClick={()=>setSelected(w)} className={`h-8 px-4 rounded-full text- font-bold transition ${selected?.id===w.id? "bg-[#FF6B35] text-black" : "bg-white text-black hover:bg-white/90"}`}>{selected?.id===w.id? "✓ Selected" : "Select"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-b from-transparent to-[#FF6B35]/[0.04] border-t border-white/[0.06]">
            <h3 className="text- tracking-[0.2em] font-bold mb-4">TRANSFER USDC {selected? `FROM ${selected.address?.slice(0,6)}...` : ""}</h3>
            <div className="space-y-3">
              <input value={to} onChange={e=>setTo(e.target.value)} placeholder="To 0x..." className="w-full h-12 rounded-full bg-black/60 border border-white/[0.08] px-5 text- outline-none focus:border-[#FF6B35]/50" />
              <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="w-full h-12 rounded-full bg-black/60 border border-white/[0.08] px-5 text- outline-none focus:border-[#FF6B35]/50" />
              <button onClick={send} disabled={loading ||!selected} className="w-full h- rounded-full bg-white text-black font-black text- disabled:opacity-30">Send {amount} USDC →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
