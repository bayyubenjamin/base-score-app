import { UserStats } from '@/lib/scoring';
import { Wallet, Activity, Layers, Coins } from 'lucide-react';

interface StatsGridProps {
  stats: UserStats | null;
  loading: boolean;
}

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
  if (loading) {
    return <div className="grid grid-cols-2 lg:grid-cols-4 gap-6"><div className="glass-emboss h-40 rounded-3xl animate-pulse"></div></div>;
  }

  if (!stats) return null;

  const walletAgeDays = stats.joinDate ? Math.ceil(Math.abs(new Date().getTime() - new Date(stats.joinDate).getTime()) / (86400000)) : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        Performance
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPICard label="Wallet Age" value={`${walletAgeDays}d`} subtext="Loyalty" icon={Wallet} delay="delay-100" />
        <KPICard label="Volume" value={stats.txCount} subtext="Transactions" icon={Activity} delay="delay-200" />
        <KPICard label="NFTs" value={stats.nftCount} subtext="Collections" icon={Layers} delay="delay-300" />
        <KPICard label="Net Worth" value={`${parseFloat(stats.ethBalance).toFixed(3)}`} subtext="ETH Balance" icon={Coins} delay="delay-100" />
      </div>
    </div>
  );
}
