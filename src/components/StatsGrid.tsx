"use client"; // Diperlukan karena kita menambah interaksi (copy to clipboard)

import { useState } from "react";
import { UserStats } from "@/lib/scoring";
import { Wallet, Layers, Activity, Calendar, User, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils"; // Asumsi kamu punya utility cn, jika tidak hapus saja dan pakai string biasa

export default function StatsGrid({ data }: { data: UserStats }) {
  const [copied, setCopied] = useState(false);

  // Format Tanggal yang lebih human-readable
  const joinDate = new Date(data.joinDate).toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });

  // Handle Copy Address
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper untuk card wrapper
  const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );

  return (
    <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
      
      {/* 1. HERO CARD: Identity (Full Width / Col Span 2 on Desktop) */}
      <Card className="col-span-2 md:col-span-2 flex flex-col justify-center">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-blue-500/20 shadow-lg">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400">Identity</h3>
              <div className="text-xl font-bold text-white">
                {data.resolvedName || "Anon User"}
              </div>
            </div>
          </div>
          {data.resolvedName && (
            <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300 border border-blue-500/20">
              Verified
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-black/20 p-2 pl-3">
          <code className="text-xs text-slate-300 font-mono truncate">
            {data.address}
          </code>
          <button
            onClick={copyToClipboard}
            className="ml-auto rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Copy Address"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </Card>

      {/* 2. MAIN STAT: ETH Balance (Big Impact) */}
      <Card className="col-span-2 md:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Net Worth</span>
            <Wallet className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {parseFloat(data.ethBalance).toFixed(4)}
            <span className="text-lg text-slate-500 ml-1">ETH</span>
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-slate-800">
             <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" />
          </div>
        </div>
      </Card>

      {/* 3. SECONDARY STAT: Tx Count */}
      <Card className="col-span-1">
        <div className="mb-2 rounded-lg bg-purple-500/10 w-fit p-2">
            <Activity className="h-5 w-5 text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{data.txCount.toLocaleString()}</div>
        <div className="text-xs text-slate-400">Total Tx</div>
      </Card>

      {/* 4. SECONDARY STAT: NFTs */}
      <Card className="col-span-1">
         <div className="mb-2 rounded-lg bg-pink-500/10 w-fit p-2">
            <Layers className="h-5 w-5 text-pink-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{data.nftCount}</div>
        <div className="text-xs text-slate-400">Collectibles</div>
      </Card>

      {/* 5. FOOTER STAT: Join Date (Full Width Mobile, Single on Desktop if needed, but let's span 2 to balance) */}
      <Card className="col-span-2 flex items-center justify-between bg-slate-800/30">
        <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
                <div className="text-xs text-slate-400">Member Since</div>
                <div className="font-semibold text-white">{joinDate}</div>
            </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">BASE MAINNET</div>
      </Card>
      
    </div>
  );
}
