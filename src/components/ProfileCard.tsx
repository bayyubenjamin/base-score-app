// src/components/ProfileCard.tsx
import { UserStats, calculateScore } from "@/lib/scoring";
import { Avatar, Name, Identity, Address } from "@coinbase/onchainkit/identity";

export default function ProfileCard({ data }: { data: UserStats }) {
  const { totalScore, level, badges } = calculateScore(data);

  // Warna dinamis berdasarkan Level
  let levelColor = "text-slate-400";
  let borderColor = "border-slate-700";
  
  if (level === "Based God") {
    levelColor = "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]";
    borderColor = "border-blue-500";
  } else if (level === "Crypto Native") {
    levelColor = "text-purple-400";
    borderColor = "border-purple-500";
  } else if (level === "Explorer") {
    levelColor = "text-green-400";
    borderColor = "border-green-500";
  }

  return (
    <div className={`w-full max-w-md bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border ${borderColor} shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
      
      {/* Background Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full -z-10`}></div>

      <div className="flex flex-col items-center">
        {/* Avatar & Name */}
        <div className="mb-4 transform transition hover:scale-110 duration-300">
            <Identity 
                address={data.address as `0x${string}`} 
                schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            >
                <Avatar className="h-24 w-24 ring-4 ring-slate-800 shadow-xl" />
            </Identity>
        </div>
        
        <div className="text-2xl font-bold text-white flex gap-2 items-center justify-center">
            {/* PERBAIKAN: Gunakan resolvedName */}
            {data.resolvedName ? (
              <span>{data.resolvedName}</span>
            ) : (
              <Name address={data.address as `0x${string}`} className="text-white" />
            )}
        </div>
        
        <div className="flex items-center gap-2 mt-1 opacity-60 hover:opacity-100 transition">
            <Address address={data.address as `0x${string}`} className="text-xs font-mono text-slate-400" />
        </div>

        {/* Score Display */}
        <div className="mt-6 flex flex-col items-center">
            <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                {totalScore}
            </span>
            <span className={`text-sm font-bold uppercase tracking-widest mt-2 ${levelColor}`}>
                {level}
            </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
            {badges.length > 0 ? badges.map((badge, i) => (
                <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-300 font-bold shadow-sm hover:bg-slate-700 transition cursor-default">
                    {badge}
                </span>
            )) : (
                <span className="text-xs text-slate-600 italic">No badges earned yet</span>
            )}
        </div>
      </div>
    </div>
  );
}
