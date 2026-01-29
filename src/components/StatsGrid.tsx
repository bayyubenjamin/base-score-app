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

<<<<<<< HEAD
  // FIX: Hitung umur wallet berdasarkan joinDate
  const walletAgeDays = (() => {
    if (!stats.joinDate) return 0;
    const join = new Date(stats.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - join.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  })();
=======
  const walletAgeDays = stats.joinDate ? Math.ceil(Math.abs(new Date().getTime() - new Date(stats.joinDate).getTime()) / (86400000)) : 0;
>>>>>>> 9a812e3 (Fix connectors list and add embossed connect modal)

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        Performance
      </h3>

<<<<<<< HEAD
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Wallet Age */}
        <StatItem
          label="Wallet Age"
          value={`${walletAgeDays} Days`} // FIX: Gunakan variabel hasil hitungan
          subtext="Loyalty Bonus"
          scoreImpact={Math.min(walletAgeDays * 0.1, 50).toFixed(0)} // FIX: Gunakan variabel hasil hitungan
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Transaction Volume */}
        <StatItem
          label="Volume"
          value={`${stats.txCount} Txns`}
          subtext="Onchain Activity"
          scoreImpact={Math.min(stats.txCount * 2, 100).toFixed(0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        {/* NFT Holdings */}
        <StatItem
          label="Collections"
          value={stats.nftCount}
          subtext="NFTs Held"
          scoreImpact={stats.nftCount * 5}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Balance */}
        <StatItem
          label="Assets"
          value={`${parseFloat(stats.ethBalance).toFixed(4)} ETH`}
          subtext="Native Balance"
          scoreImpact="--"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Informatif: Suggestion Box */}
      <div className="glass-card p-4 rounded-xl border-l-4 border-l-yellow-500 bg-yellow-500/5">
        <h4 className="text-yellow-500 font-bold text-sm mb-1 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Boost Your Score
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Minting a <strong>Basename</strong> or holding &gt; 0.1 ETH can increase your Identity score by up to 150 points.
        </p>
=======
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPICard label="Wallet Age" value={`${walletAgeDays}d`} subtext="Loyalty" icon={Wallet} delay="delay-100" />
        <KPICard label="Volume" value={stats.txCount} subtext="Transactions" icon={Activity} delay="delay-200" />
        <KPICard label="NFTs" value={stats.nftCount} subtext="Collections" icon={Layers} delay="delay-300" />
        <KPICard label="Net Worth" value={`${parseFloat(stats.ethBalance).toFixed(3)}`} subtext="ETH Balance" icon={Coins} delay="delay-100" />
>>>>>>> 9a812e3 (Fix connectors list and add embossed connect modal)
      </div>
    </div>
  );
}
