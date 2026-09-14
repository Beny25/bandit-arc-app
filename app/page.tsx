"use client";
import { useState } from "react";

export default function Home() {
  const [wallet, setWallet] = useState("0xBandit...Arc");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arc Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w- h- bg-gradient-to-b from-[#FF6B35]/20 via-[#FF8C42]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w- h- bg-gradient-to-t from-[#FF6B35]/10 to-transparent rounded-full blur-3xl" />

      <div className="w-full max-w- relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text- tracking-[0.2em] text-white/60 font-medium">LIVE • ARC-TESTNET</span>
          </div>
          <h1 className="text- font-black tracking-tighter leading-none">
            BANDIT<span className="text-[#FF6B35]">.</span>
          </h1>
          <p className="text- tracking-[0.3em] text-white/40 mt-2 font-medium">ARC TESTNET MINI APP</p>
          <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20">
            <span className="text- text-[#FF6B35] font-mono">bandit.base.eth</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded- bg-white/[0.06] border border-white/[0.08] backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(255,107,53,0.15)]">
          {/* Wallet Section */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex justify-between items-center mb-4">
              <span className="text- tracking-widest text-white/40 font-semibold">DEV WALLETS</span>
              <div className="flex gap-2">
                <a href="https://faucet.circle.com/" target="_blank" className="text- px-3 py-1 rounded-full bg-white text-black font-bold hover:bg-white/90 transition">Faucet ↗</a>
                <span className="text- px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/60">Full SDK</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button className="flex-1 h-10 rounded-full bg-[#FF6B35] text-black text- font-bold hover:bg-[#FF7A4D] transition">+ Create Wallet</button>
              <button className="flex-1 h-10 rounded-full bg-white/[0.08] border border-white/10 text- font-semibold hover:bg-white/[0.12] transition">Import Wallet</button>
            </div>

            <p className="text- text-white/30 mb-3">Read-only via Arc RPC</p>

            <div className="flex items-center justify-between p-3 rounded-full bg-black/40 border border-white/[0.06]">
              <span className="font-mono text- text-white/80">0x...{wallet.slice(-4)}</span>
              <div className="flex gap-2">
                <button className="text- px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.12]">Check</button>
                <button className="text- px-3 py-1 rounded-full bg-white text-black font-bold">Copy & Faucet</button>
              </div>
            </div>
          </div>

          {/* Transfer Section */}
          <div className="p-6 bg-gradient-to-b from-transparent to-[#FF6B35]/[0.03]">
            <h3 className="text- font-bold tracking-widest mb-4">TRANSFER USDC</h3>

            <div className="space-y-3">
              <div>
                <label className="text- text-white/40 tracking-widest mb-2 block">FROM</label>
                <div className="h-12 rounded-full bg-black/50 border border-white/[0.06] px-4 flex items-center text- text-white/40">
                  Select wallet
                </div>
              </div>

              <div>
                <label className="text- text-white/40 tracking-widest mb-2 block">TO</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="0x..."
                  className="w-full h-12 rounded-full bg-black/50 border border-white/[0.06] px-4 text- placeholder:text-white/20 outline-none focus:border-[#FF6B35]/50 transition"
                />
              </div>

              <div>
                <label className="text- text-white/40 tracking-widest mb-2 block">AMOUNT</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-12 rounded-full bg-black/50 border border-white/[0.06] px-4 text- outline-none focus:border-[#FF6B35]/50 transition"
                />
              </div>

              <button className="w-full h- rounded-full bg-white text-black font-black text- tracking-wide hover:bg-white/90 transition shadow-[0_0_30px_rgba(255,255,255,0.2)] mt-2">
                Send {amount} USDC →
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="flex justify-between items-center">
                <span className="text- tracking-widest text-white/30">LAST TX</span>
                <span className="text- text-white/20">Belum ada TX</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text- tracking-[0.2em] text-white/20 mt-6">BUILT FOR ARC • BANDIT 2025</p>
      </div>
    </div>
  );
}
