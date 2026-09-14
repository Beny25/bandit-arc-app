
"use client";
import { useEffect, useState } from "react";
type Wallet = { id: string; address: string; blockchain: string; state: string };

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selected, setSelected] = useState<Wallet | null>(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");
  const [importAddr, setImportAddr] = useState("");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lastTx, setLastTx] = useState<any>(null);

  const loadWallets = async () => {
    const res = await fetch("/api/wallets");
    const data = await res.json();
    const list = data.wallets || [];
    setWallets(list);
    if (list.length &&!selected) setSelected(list[0]);
    list.forEach(async (w: Wallet) => {
      const b = await fetch(`/api/balance?address=${w.address}`).then(r=>r.json());
      setBalances(prev => ({...prev, [w.address]: b.formatted }));
    });
  };
  useEffect(()=>{ loadWallets(); }, []);

  const createWallet = async () => {
    setLoading(true);
    await fetch("/api/wallets", { method: "POST" });
    await loadWallets(); setLoading(false);
  };
  const handleFaucet = (addr: string) => {
    if(!addr) return alert("Isi address dulu");
    navigator.clipboard.writeText(addr);
    window.open("https://faucet.circle.com", "_blank");
  };
  const handleTransfer = async () => {
    setLoading(true);
    const res = await fetch("/api/transfer", { method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ walletId: selected?.id, destinationAddress: to, amount }) });
    const data = await res.json(); setLastTx(data); await loadWallets(); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,211,149,0.15),_transparent_60%)] pointer-events-none"/>
      <div className="relative max-w- mx-auto p-5 md:p-8 space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center font-black">B</div>
            <div><h1 className="text- font-black tracking-[0.14em]">BANDIT • ARC</h1><p className="text- text-zinc-500 tracking-widest">TESTNET MINI APP</p></div>
            <span className="hidden md:flex ml-4 h-2 w-2 bg-[#00D395] rounded-full animate-pulse"/><span className="hidden md:flex text- font-bold tracking-widest">LIVE • ARC-TESTNET</span>
          </div>
          <div className="flex gap-2"><div className="text- bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full font-mono">bandit.base.eth</div><a href="https://faucet.circle.com" target="_blank" className="text- bg-white text-black px-3.5 py-1.5 rounded-full font-bold">Faucet ↗</a></div>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-[#121214] border border-zinc-800 rounded- p-6">
            <div className="flex justify-between items-center mb-5"><div><h2 className="font-semibold">Dev Wallets</h2><p className="text- text-zinc-500">Full SDK</p></div><button onClick={createWallet} disabled={loading} className="bg-white text-black px-4 py-2 rounded-full text-xs font-black">{loading?"...":"+ Create Wallet"}</button></div>
            <div className="space-y-3 max-h- overflow-auto">
              {wallets.map(w=>{
                const isSel = selected?.id===w.id;
                return <div key={w.id} className={`rounded- border p-4 flex justify-between items-center ${isSel?"bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]":"bg-[#0e0e10] border-zinc-800"}`}>
                  <div><div className="font-mono text- opacity-60">{w.id.slice(0,8)}... • {w.state}</div><div className="font-mono text- truncate">{w.address}</div><div className="mt-1 text- font-black">{balances[w.address]? Number(balances[w.address]).toLocaleString() : "—"} <span className="text-">USDC</span></div></div>
                  <div className="flex flex-col gap-1.5"><button onClick={()=>setSelected(w)} className={`text- px-3 py-1.5 rounded-full font-black ${isSel?"bg-black text-white":"bg-zinc-800 text-white"}`}>USE</button><button onClick={()=>handleFaucet(w.address)} className="text- bg-[#00D395] text-black px-3 py-1.5 rounded-full font-black">FAUCET ↗</button></div>
                </div>
              })}
            </div>
          </div>
          <div className="bg-[#121214] border border-zinc-800 rounded- p-6">
            <h2 className="font-semibold">Import Wallet</h2><p className="text- text-zinc-500 mt-1">Read-only via Arc RPC</p>
            <input value={importAddr} onChange={e=>setImportAddr(e.target.value)} placeholder="0x..." className="mt-4 w-full bg-[#0e0e10] border border-zinc-800 rounded- px-3.5 py-3 text-sm font-mono"/>
            <div className="grid grid-cols-2 gap-2 mt-3"><button onClick={async()=>{ const b=await fetch(`/api/balance?address=${importAddr}`).then(r=>r.json()); setBalances(p=>({...p, [importAddr]: b.formatted})); }} className="bg-zinc-800 py-2.5 rounded- text-xs font-bold">Check</button><button onClick={()=>handleFaucet(importAddr)} className="bg-[#00D395] text-black py-2.5 rounded- text-xs font-black">Copy & Faucet</button></div>
            {importAddr && balances[importAddr] && <div className="mt-4 bg-[#0e0e10] border border-zinc-800 rounded- p-4"><div className="text- text-zinc-500 font-mono truncate">{importAddr}</div><div className="text- font-black">{balances[importAddr]} USDC</div><a href={`https://testnet.arcscan.app/address/${importAddr}`} target="_blank" className="text- underline text-zinc-400">View on ArcScan ↗</a></div>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-[#121214] border border-zinc-800 rounded- p-6">
            <h2 className="font-semibold">Transfer USDC</h2>
            <div className="mt-5 space-y-4">
              <div><label className="text- font-bold text-zinc-500">FROM</label><div className="mt-1.5 bg-[#0e0e10] border border-zinc-800 rounded- px-3.5 py-3 font-mono text-xs truncate">{selected?.address || "Select wallet"}</div></div>
              <div><label className="text- font-bold text-zinc-500">TO</label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="0x..." className="mt-1.5 w-full bg-[#0e0e10] border border-zinc-800 rounded- px-3.5 py-3 font-mono text-sm"/></div>
              <div><label className="text- font-bold text-zinc-500">AMOUNT</label><input value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1.5 w-full bg-[#0e0e10] border border-zinc-800 rounded- px-3.5 py-3 text-sm font-bold"/></div>
              <button onClick={handleTransfer} disabled={loading ||!selected} className="w-full bg-white text-black py-3.5 rounded- font-black">Send {amount} USDC →</button>
            </div>
          </div>
          <div className="bg-[#121214] border border-zinc-800 rounded- p-6">
            <h2 className="font-semibold">Last TX</h2>
            {lastTx? <div className="mt-4 bg-[#0e0e10] border border-zinc-800 rounded- p-4 font-mono text-"><div>Hash: {lastTx.txHash || lastTx.transaction?.txHash}</div><a href={`https://testnet.arcscan.app/tx/${lastTx.txHash}`} target="_blank" className="block mt-3 text-center bg-zinc-900 py-2.5 rounded- font-bold">View on ArcScan ↗</a></div> : <div className="mt-4 text-center text-zinc-500 text-sm">Belum ada TX</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
