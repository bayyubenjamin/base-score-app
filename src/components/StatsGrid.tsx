import { UserStats } from '@/lib/scoring';
import { Wallet, Activity, Layers, Coins, TrendingUp } from 'lucide-react';

interface StatsGridProps {
  stats: UserStats | null;
  loading: boolean;
}

// Helper component for KPI Cards
const KPICard = ({ label, value, subtext, icon: Icon, trend }: any) => (
  <div className="pro-card p-5 rounded-xl flex flex-col justify-between h-full hover:border-blue-500/30 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-gray-800/50 rounded-lg text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
          +{trend}
        </span>
      )}
    </div>
    <div>
      <h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{label}</p>
      {subtext && <p className="text-[11px] text-gray-600 mt-2">{subtext}</p>}
    </div>
  </div>
);

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-gray-800/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const walletAgeDays = (() => {
    if (!stats.joinDate) return 0;
    const join = new Date(stats.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - join.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  })();

  const ethBalance = parseFloat(stats.ethBalance).toFixed(4);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Activity size={18} className="text-blue-500" />
        Performance Metrics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Wallet Age"
          value={`${walletAgeDays} Days`}
          subtext="Since first transaction"
          icon={Wallet}
          trend={Math.min(walletAgeDays * 0.1, 50).toFixed(0)}
        />

        <KPICard
          label="Total Volume"
          value={stats.txCount}
          subtext="Lifetime transactions"
          icon={TrendingUp}
          trend={Math.min(stats.txCount * 2, 100).toFixed(0)}
        />

        <KPICard
          label="NFT Assets"
          value={stats.nftCount}
          subtext="Collections owned"
          icon={Layers}
          trend={stats.nftCount * 5}
        />

        <KPICard
          label="Net Worth"
          value={`${ethBalance} ETH`}
          subtext="Current native balance"
          icon={Coins}
        />
      </div>
    </div>
  );
}
