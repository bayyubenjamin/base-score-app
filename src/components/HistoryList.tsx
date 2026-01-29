import { Transaction } from "@/lib/scoring";
import { ExternalLink, ArrowDownLeft, ArrowUpRight, FileClock } from "lucide-react";

export default function HistoryList({ 
  history, 
  currentAddress 
}: { 
  history: Transaction[], 
  currentAddress: string 
}) {
  const formatAddr = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Unknown";
  
  const formatValue = (val: string) => {
    const num = parseFloat(val);
    if (num === 0) return "0.00";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  if (!history || history.length === 0) {
    return (
      <div className="mt-8 p-12 text-center rounded-xl border border-dashed border-gray-800">
        <p className="text-gray-500">No recent transaction data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileClock size={18} className="text-blue-500" />
          Recent Transactions
        </h3>
      </div>

      <div className="bg-[#151A25] border border-[#2B3240] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Counterparty</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.map((tx, idx) => {
                const isIncoming = tx.to?.toLowerCase() === currentAddress.toLowerCase();
                const displayDate = new Date().toLocaleDateString("en-US", {
                    month: 'short', day: 'numeric', year: 'numeric'
                });

                return (
                  <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium ${
                        isIncoming ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isIncoming ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {isIncoming ? "Receive" : "Send"}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300 font-mono">
                      {formatAddr(isIncoming ? tx.from : tx.to)}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {displayDate}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-sm font-medium ${isIncoming ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {isIncoming ? "+" : "-"}{formatValue(tx.value)} ETH
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <a 
                        href={`https://basescan.org/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-400 transition-colors inline-block p-1"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
