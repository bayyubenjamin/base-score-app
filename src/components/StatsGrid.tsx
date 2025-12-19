// src/components/StatsGrid.tsx
import { UserStats } from "@/lib/scoring";
import { Wallet, Layers, Activity, Calendar } from "lucide-react";

export default function StatsGrid({ data }: { data: UserStats }) {
  const items = [
    { label: "ETH Balance", value: `${data.ethBalance} ETH`, icon: Wallet },
    { label: "Tx Count", value: data.txCount, icon: Activity },
    { label: "NFTs Owned", value: data.nftCount, icon: Layers },
    { label: "Joined", value: "2024", icon: Calendar }, // Simplified
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 transition">
          <item.icon className="w-5 h-5 text-blue-400 mb-2" />
          <span className="text-lg font-bold text-white">{item.value}</span>
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
