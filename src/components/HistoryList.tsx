// src/components/HistoryList.tsx
import { Transaction } from "@/lib/scoring";
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function HistoryList({ history, currentAddress }: { history: Transaction[], currentAddress: string }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-6">
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        {history.map((tx, idx) => {
            const isIn = tx.to?.toLowerCase() === currentAddress.toLowerCase();
            return (
                <div key={idx} className="p-4 border-b border-slate-800 last:border-0 flex justify-between items-center hover:bg-slate-800/50 transition">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isIn ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {isIn ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-white">
                                {isIn ? "Received" : "Sent"} {tx.asset}
                            </div>
                            <div className="text-xs text-slate-500">
                                {new Date().toLocaleDateString()} {/* Idealnya ambil timestamp per tx jika API menyediakan */}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`font-mono font-bold ${isIn ? 'text-green-400' : 'text-white'}`}>
                            {isIn ? '+' : '-'}{parseFloat(tx.value).toFixed(4)}
                        </span>
                        <a 
                            href={`https://basescan.org/tx/${tx.hash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-blue-400"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
