// src/components/ProfileCard.tsx
import { UserStats, calculateScore } from "@/lib/scoring";
import { Avatar, Name, Address } from "@coinbase/onchainkit/identity"; // Import komponen resmi

interface Props {
  data: UserStats;
}

export default function ProfileCard({ data }: Props) {
  const { totalScore, level, badges } = calculateScore(data);
  const scoreColor = totalScore > 75 ? "text-green-400" : totalScore > 40 ? "text-yellow-400" : "text-gray-400";

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden mb-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-20 pointer-events-none"></div>

      <div className="flex flex-col items-center text-center">
        {/* AVATAR & NAMA OTOMATIS DARI ONCHAINKIT */}
        <div className="h-20 w-20 rounded-full bg-slate-800 border-2 border-blue-500 mb-4 overflow-hidden">
             <Avatar address={data.address as `0x${string}`} className="h-full w-full" />
        </div>

        {/* NAMA: Gunakan komponen <Name> agar otomatis resolve */}
        <div className="text-2xl font-bold text-white flex gap-2 items-center justify-center">
           {/* Prioritaskan nama dari backend, kalau null biarkan OnchainKit cari sendiri */}
           {data.basename ? (
             <span>{data.basename}</span>
           ) : (
             <Name address={data.address as `0x${string}`} className="text-white" />
           )}
        </div>

        {/* ADDRESS */}
        <div className="text-slate-400 text-sm font-mono mb-6 bg-slate-950 px-3 py-1 rounded-full mt-2">
            <Address address={data.address as `0x${string}`} />
        </div>

        {/* SCORE */}
        <div className="mb-6 relative">
           <div className={`text-6xl font-black ${scoreColor} drop-shadow-lg`}>
             {totalScore}
           </div>
           <div className="text-slate-500 uppercase text-xs tracking-widest mt-1">Onchain Score</div>
        </div>

        {/* LEVEL */}
        <div className="mb-6">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold border border-blue-400 shadow-blue-900/50 shadow-lg">
            {level}
          </span>
        </div>

        {/* BADGES */}
        <div className="flex flex-wrap gap-2 justify-center">
          {badges.length > 0 ? badges.map((badge, idx) => (
            <span key={idx} className="bg-slate-800 border border-slate-600 text-xs px-2 py-1 rounded-md text-slate-300">
              {badge}
            </span>
          )) : (
            <span className="text-slate-600 text-xs italic">No badges yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
