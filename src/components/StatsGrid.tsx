// src/components/StatsGrid.tsx
import { UserStats } from "@/lib/scoring";
import { Wallet, Layers, Activity, Calendar, User } from "lucide-react";

export default function StatsGrid({ data }: { data: UserStats }) {
  // Format Tanggal
  const formattedDate = new Date(data.joinDate).toLocaleDateString("id-ID", {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const items = [
    { 
      label: "Identity", 
      value: data.resolvedName || "No Basename", 
      icon: User,
      subValue: `${data.address.slice(0,6)}...${data.address.slice(-4)}`
    },
    { 
      label: "ETH Balance", 
      value: `${parseFloat(data.ethBalance).toFixed(4)} ETH`, 
      icon: Wallet 
    },
    { 
      label: "Total Tx", 
      value: data.txCount.toLocaleString(), 
      icon: Activity 
    },
    { 
      label: "NFTs Owned", 
      value: data.nftCount, 
      icon: Layers 
    },
    { 
      label: "Joined Base", 
      value: formattedDate, 
      icon: Calendar 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center space-x-4 hover:bg-slate-800 transition">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <item.icon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white truncate max-w-[150px] md:max-w-[200px]">
                {item.value}
            </div>
            <div className="text-sm text-slate-400">{item.label}</div>
            {item.subValue && (
                <div className="text-xs text-slate-600 mt-1">{item.subValue}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
