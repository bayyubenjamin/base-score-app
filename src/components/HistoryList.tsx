import { Transaction } from "@/lib/scoring";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, SearchX } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan ada cn utility, atau pakai template literal biasa

export default function HistoryList({ 
  history, 
  currentAddress 
}: { 
  history: Transaction[], 
  currentAddress: string 
}) {
  // Helper: Format Address (0x1234...5678)
  const truncateAddr = (addr: string) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Helper: Format Value biar gak berantakan kalau desimal panjang
  const formatValue = (val: string) => {
    const num = parseFloat(val);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  // 1. Handle Empty State dengan Cantik
  if (!history || history.length === 0) {
    return (
      <div className="w-full max-w-3xl mt-8">
        <h3 className="text-xl font-bold text-white mb-4 px-1">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30">
          <div className="bg-slate-800/50 p-4 rounded-full mb-3">
            <SearchX className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No transactions found</p>
          <p className="text-slate-600 text-sm">Your blockchain footprint is clean.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mt-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
          Last {history.length} Tx
        </span>
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="divide-y divide-slate-800/50">
          {history.map((tx, idx) => {
            const isIncoming = tx.to?.toLowerCase() === currentAddress.toLowerCase();
            const counterParty = isIncoming ? tx.from : tx.to;
            
            // Simulasi tanggal (karena data API mungkin raw block timestamp)
            // Idealnya: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString...
            const displayDate = new Date().toLocaleDateString("id-ID", {
                day: 'numeric', month: 'short'
            });

            return (
              <div 
                key={idx} 
                className="group relative flex items-center justify-between p-4 hover:bg-slate-800/40 transition-all duration-200"
              >
                {/* Left Side: Icon & Context */}
                <div className="flex items-center gap-4">
                  {/* Icon Indicator */}
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border shadow-sm",
                    isIncoming 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  )}>
                    {isIncoming ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-200">
                      {isIncoming ? "Received from" : "Sent to"}
                      <span className="ml-1 font-mono text-slate-400 group-hover:text-blue-400 transition-colors">
                        {truncateAddr(counterParty)}
                      </span>
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {displayDate}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold border border-slate-800 px-1 rounded">
                            {tx.asset || "ETH"}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Amount & Link */}
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "font-mono font-bold text-sm tracking-tight",
                      isIncoming ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {isIncoming ? "+" : "-"}{formatValue(tx.value)}
                    </span>
                    <span className="text-xs text-slate-500">
                        {tx.asset || "ETH"}
                    </span>
                  </div>
                  
                  <a 
                    href={`https://basescan.org/tx/${tx.hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-600 hover:bg-white/5 hover:text-blue-400 transition-all"
                    title="View on Basescan"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer List (Optional: View All) */}
        <div className="bg-slate-900/80 p-3 text-center border-t border-slate-800/50">
            <a href={`https://basescan.org/address/${currentAddress}`} target="_blank" className="text-xs text-slate-400 hover:text-white transition-colors">
                View full history on Basescan &rarr;
            </a>
        </div>
      </div>
    </div>
  );
}
