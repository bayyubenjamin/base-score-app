import { Copy } from 'lucide-react';

interface ProfileCardProps {
  address: string | null;
  loading: boolean;
}

export function ProfileCard({ address, loading }: ProfileCardProps) {
  if (loading || !address) return <div className="glass-emboss h-24 rounded-3xl animate-pulse"></div>;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="glass-emboss w-full rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

      <div className="flex items-center gap-5 z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full rounded-xl bg-black flex items-center justify-center font-black text-xl text-white">
               {address.slice(2, 4).toUpperCase()}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10B981] border-4 border-[#050505] rounded-full"></div>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white">Onchain Identity</h2>
          <button 
            onClick={() => navigator.clipboard.writeText(address)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors mt-1 border border-white/5"
          >
            <span className="text-sm text-gray-400 font-mono">{shortAddress}</span>
            <Copy size={12} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
