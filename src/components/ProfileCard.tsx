import Image from 'next/image';

interface ProfileCardProps {
  address: string | null;
  loading: boolean;
}

export function ProfileCard({ address, loading }: ProfileCardProps) {
  if (loading) {
    return (
      <div className="glass-card w-full h-24 rounded-2xl animate-pulse flex items-center p-4 gap-4">
        <div className="w-16 h-16 bg-white/10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!address) return null;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="glass-card w-full rounded-2xl p-6 flex items-center justify-between mb-6 shadow-lg relative overflow-hidden group">
      {/* Background Gradient Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-center gap-4 z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0f1115] flex items-center justify-center overflow-hidden">
               {/* Fallback Avatar */}
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#0f1115] rounded-full"></div>
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-wide">Base Explorer</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-mono bg-black/30 px-2 py-1 rounded-md border border-white/5">
              {shortAddress}
            </span>
            <button 
              onClick={() => navigator.clipboard.writeText(address)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end z-10">
        <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Status</span>
        <span className="text-sm font-medium text-white bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mt-1">
          Active Member
        </span>
      </div>
    </div>
  );
}
