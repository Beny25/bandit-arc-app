"use client";
import { useState, useEffect } from "react";

export default function Home(){
  const [wallets, setWallets] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState("");

  const loadWallets = async () => {
    try {
      const r = await fetch("/api/wallets");
      const d = await r.json();
      if(d.data?.wallets) setWallets(d.data.wallets);
      else if(d.wallets) setWallets(d.wallets);
    } catch {}
  };

  useEffect(()=>{ loadWallets(); }, []);

  const createWallet = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/wallets", { method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({}) });
      const d = await r.json();
      console.log("CREATE:", d);
      alert(d.error? "Error: "+JSON.stringify(d) : "Wallet created! "+ (d.data?.wallets?.[0]?.address || d.data?.address || "check console"));
      await loadWallets();
    } catch(e:any){ alert("Error: "+e.message); }
    setLoading(false);
  };

  const send = async () => {
    if(!selected) return alert("Pilih FROM wallet dulu bro!");
    if(!to) return alert("Isi TO address bro!");
    setLoading(true);
    try {
      const r = await fetch("/api/transfer", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ walletId: selected, destinationAddress: to, amount }) });
      const d = await r.json();
      console.log("SEND:", d);
      setLastTx(JSON.stringify(d).slice(0,100));
      alert(d.error? "Error: "+JSON.stringify(d) : "Transfer sent! Tx: "+ (d.data?.id || "check console"));
    } catch(e:any){ alert(e.message); }
    setLoading(false);
  };

  return(
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w- h- bg-gradient-to-b from-[#FF6B35]/20 to-transparent rounded-full blur-3xl" />
      <div className="w-full max-w- relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl mb-4"><div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" /><span className="text- tracking-[0.2em] text-white/60">LIVE • ARC-TESTNET</span></div>
          <h1 className="text- font-black tracking-tighter">BANDIT<span className="text-[#FF6B35]">.</span></h1>
          <p className="text- tracking-[0.3em] text-white/40 mt-1">ARC TESTNET MINI APP</p>
          <div className="mt-3 inline-flex px-4 py-1 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] font-mono text-">bandit.base.eth</div>
        </div>
        <div className="rounded- bg-white/[0.06] border border-white/[0.08] backdrop-blur-2xl overflow-hidden">
          <div className="p-7 border-b border-white/[0.06]">
            <div className="flex justify-between items-center mb-5"><span className="text- tracking-widest text-white/40">DEV WALLETS ({wallets.length})</span><a href="https://faucet.circle.com/" target="_blank" className="text- px-3 py-1.5 rounded-full bg-white text-black font-bold">Faucet ↗</a></div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button onClick={createWallet} disabled={loading} className="h-11 rounded-full bg-[#FF6B35] text-black text- font-bold disabled:opacity-50">{loading? "..." : "+ Create Wallet"}</button>
              <button onClick={loadWallets} className="h-11 rounded-full bg-white/[0.08] border border-white/10 text-">Refresh</button>
            </div>
            <div className="space-y-2 max-h- overflow-auto">
              {wallets.length===0 && <p className="text- text-white/30">Belum ada wallet, klik Create</p>}
              {wallets.map((w:any)=>(
                <div key={w.id} onClick={()=>setSelected(w.id)} className={`p-3 rounded-full bg-black/50 border flex justify-between items-center cursor-pointer ${selected===w.id? "border-[#FF6B35]" : "border-white/[0.06]"}`}>
                  <span className="font-mono text- text-white/70 truncate">{w.address || w.id}</span>
                  <span className="text- px-2 py-1 rounded-full bg-white/[0.08]">{selected===w.id? "Selected" : "Select"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-7">
            <h3 className="text- font-bold tracking-[0.2em] mb-5">TRANSFER USDC</h3>
            <div className="space-y-4">
              <div><label className="text- text-white/40 tracking-widest mb-2 block">FROM {selected? "✓" : ""}</label><div className="h-12 rounded-full bg-black/50 border border-white/[0.06] px-5 flex items-center text- text-white/40 truncate">{selected || "Select wallet above"}</div></div>
              <div><label className="text- text-white/40 tracking-widest mb-2 block">TO</label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="0x..." className="w-full h-12 rounded-full bg-black/50 border border-white/[0.06] px-5 text- outline-none focus:border-[#FF6B35]/50" /></div>
              <div><label className="text- text-white/40 tracking-widest mb-2 block">AMOUNT</label><input value={amount} onChange={e=>setAmount(e.target.value)} className="w-full h-12 rounded-full bg-black/50 border border-white/[0.06] px-5 text- outline-none" /></div>
              <button onClick={send} disabled={loading} className="w-full h- rounded-full bg-white text-black font-black text- disabled:opacity-50">{loading? "Sending..." : `Send ${amount} USDC →`}</button>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex justify-between"><span className="text- tracking-widest text-white/30">LAST TX</span><span className="text- text-white/30 truncate ml-2">{lastTx || "Belum ada TX"}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
