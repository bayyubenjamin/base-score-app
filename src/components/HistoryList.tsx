// src/components/HistoryList.tsx
import { Transaction } from "@/lib/scoring";

interface Props {
  history: Transaction[];
  ownerAddress: string;
}

export default function HistoryList({ history, ownerAddress }: Props) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center text-slate-500 py-6 bg-slate-900/50 rounded-xl mt-6 border border-slate-800 border-dashed">
        No recent activity found on Base.
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6 shadow-lg">
      <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 backdrop-blur-sm flex justify-between items-center">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
            📊 Recent Activity 
        </h3>
        <span className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400">Last 10 Tx</span>
      </div>
      
      <div className="divide-y divide-slate-800">
        {history.map((tx) => {
          const isIn = tx.to.toLowerCase() === ownerAddress.toLowerCase();
          const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString(undefined, {
            day: 'numeric', month: 'short'
          });
          const val = parseFloat(tx.value);
          const isZero = val === 0;

          return (
            <div key={tx.hash} className="p-3 flex items-center justify-between hover:bg-slate-800 transition group">
              
              {/* Kiri: Ikon & Info Dasar */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full flex-shrink-0 ${isIn ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isIn ? (
                     // Icon Panah Masuk
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                  ) : (
                     // Icon Panah Keluar
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className={`text-xs font-bold font-mono ${isIn ? 'text-green-200' : 'text-red-200'}`}>
                    {isIn ? "Received" : "Sent"}
                  </span>
                  <span className="text-[10px] text-slate-500">{date}</span>
                </div>
              </div>

              {/* Kanan: Nilai & Link */}
              <div className="text-right">
                <div className="font-mono text-xs md:text-sm text-slate-200 font-bold">
                    {isZero ? "Interaction" : `${val.toFixed(4)} ETH`}
                </div>
                <a 
                    href={`https://basescan.org/tx/${tx.hash}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-blue-500 hover:text-blue-400 underline decoration-dotted opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    View Tx
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
