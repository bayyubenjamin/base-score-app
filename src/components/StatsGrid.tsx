import { UserStats } from '@/lib/scoring';
import { Wallet, Activity, Layers, Coins } from 'lucide-react';

interface StatsGridProps {
  stats: UserStats | null;
  loading: boolean;
}

// Komponen Kartu dengan Efek Emboss & Animasi
const KPICard = ({ label, value, subtext, icon: Icon, delay }: any) => (
  <div className={`glass-emboss p-6 rounded-3xl flex flex-col justify-between h-full group animate-slide-up ${delay}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gradient-to-br from-white/10 to-transparent rounded-2xl text-white/80 group-hover:scale-110 group-hover:text-blue-400 transition-all shadow-inner border border-white/5">
        <Icon size={24} />
      </div>
    </div>
    <div>
      <h4 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{value}</h4>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-2">{label}</p>
      {subtext && <p className="text-[10px] text-blue-400/80 mt-1 font-mono">{subtext}</p>}
    </div>
  </div>
);

export function StatsGrid({ stats, loading }: StatsGridProps) {
  // Tampilan Loading Skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-emboss h-40 rounded-3xl animate-pulse bg-white/5" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // Hitung Umur Wallet dalam Hari
  const walletAgeDays = stats.joinDate 
    ? Math.ceil(Math.abs(new Date().getTime() - new Date(stats.joinDate).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Format Balance
  const ethBalance = parseFloat(stats.ethBalance).toFixed(4);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_#3B82F6]"></span>
        Performance Metrics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Wallet Age */}
        <KPICard 
          label="Wallet Age" 
          value={`${walletAgeDays}d`} 
          subtext="Loyalty Score" 
          icon={Wallet} 
          delay="delay-100" 
        />

        {/* Transaction Volume */}
        <KPICard 
          label="Volume" 
          value={stats.txCount} 
          subtext="Total Transactions" 
          icon={Activity} 
          delay="delay-200" 
        />

        {/* NFT Holdings */}
        <KPICard 
          label="NFTs" 
          value={stats.nftCount} 
          subtext="Collections Held" 
          icon={Layers} 
          delay="delay-300" 
        />

        {/* ETH Balance */}
        <KPICard 
          label="Net Worth" 
          value={`${ethBalance}`} 
          subtext="ETH Balance" 
          icon={Coins} 
          delay="delay-100" 
        />
      </div>
    </div>
  );
}
