import { UserStats } from '@/lib/scoring';

interface StatsGridProps {
  stats: UserStats | null;
  loading: boolean;
}

// Helper component for individual stat cards
const StatItem = ({ label, value, subtext, icon, scoreImpact }: any) => (
  <div className="glass-card p-4 rounded-xl flex flex-col gap-2 transition-transform duration-200 hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
        {icon}
      </div>
      {scoreImpact && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
          +{scoreImpact} pts
        </span>
      )}
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">{label}</p>
      <p className="text-xl font-bold text-white mt-0.5">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  </div>
);

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-lg">Breakdown</h3>
        <span className="text-xs text-gray-500">Last updated: Just now</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Wallet Age */}
        <StatItem
          label="Wallet Age"
          value={`${stats.walletAgeDays || 0} Days`} // Added fallback
          subtext="Loyalty Bonus"
          scoreImpact={Math.min((stats.walletAgeDays || 0) * 0.1, 50).toFixed(0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Transaction Volume */}
        <StatItem
          label="Volume"
          value={`${stats.txCount} Txns`} // Fixed property name from transactionCount to txCount based on UserStats type
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
          {/* FIX: Changed > to &gt; */}
          Minting a <strong>Basename</strong> or holding &gt; 0.1 ETH can increase your Identity score by up to 150 points.
        </p>
      </div>
    </div>
  );
}
