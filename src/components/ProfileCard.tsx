import { Copy } from 'lucide-react';

interface ProfileCardProps {
  address: string | null;
  loading: boolean;
}

export function ProfileCard({ address, loading }: ProfileCardProps) {
  if (loading) {
    return (
      <div className="pro-card w-full h-20 rounded-xl animate-pulse flex items-center p-6 gap-4 border-l-4 border-l-gray-700">
        <div className="w-12 h-12 bg-gray-800 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-800 rounded w-1/4" />
          <div className="h-3 bg-gray-800 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!address) return null;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    // Bisa tambahkan toast notification disini
  };

  return (
    <div className="pro-card w-full rounded-xl p-6 flex items-center justify-between mb-8 border-l-4 border-l-blue-600 bg-gradient-to-r from-[#151A25] to-[#11141D]">
      <div className="flex items-center gap-5">
        {/* Avatar Placeholder Professional */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-900/20">
            {address.slice(2, 4).toUpperCase()}
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#151A25] rounded-full"></div>
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-tight">Base Identity</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400 font-mono">
              {shortAddress}
            </span>
            <button 
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-gray-500 hover:text-blue-400"
              title="Copy Address"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Network</span>
        <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-900/30">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-blue-400">Base Mainnet</span>
        </div>
      </div>
    </div>
  );
}
