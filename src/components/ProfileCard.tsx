// src/components/ProfileCard.tsx
import { UserStats, calculateScore } from "@/lib/scoring";
import { Avatar, Name, Identity, Address } from "@coinbase/onchainkit/identity";

export default function ProfileCard({ data }: { data: UserStats }) {
  const { totalScore, level, badges } = calculateScore(data);

  // LOGIKA WARNA & STYLE (Diperbarui untuk desain baru yang lebih "Cyber/Neon")
  let accentGradient = "from-slate-600 to-slate-800";
  let shadowColor = "shadow-slate-900/50";
  let textColor = "text-slate-300";
  let ringColor = "ring-slate-700";

  if (level === "Based God") {
    // Biru Elektrik ke Cyan
    accentGradient = "from-blue-600 via-cyan-500 to-blue-600";
    shadowColor = "shadow-blue-500/40";
    textColor = "text-blue-100";
    ringColor = "ring-blue-500";
  } else if (level === "Crypto Native") {
    // Ungu Neon ke Pink
    accentGradient = "from-purple-600 via-fuchsia-500 to-purple-600";
    shadowColor = "shadow-purple-500/40";
    textColor = "text-purple-100";
    ringColor = "ring-purple-500";
  } else if (level === "Explorer") {
    // Emerald Hijau
    accentGradient = "from-emerald-600 via-green-500 to-emerald-600";
    shadowColor = "shadow-emerald-500/40";
    textColor = "text-emerald-100";
    ringColor = "ring-emerald-500";
  }

  return (
    <div className="w-full max-w-md relative group perspective-1000">
      
      {/* 1. ANIMATED GLOWING BORDER (Di belakang kartu utama) */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${accentGradient} 
        rounded-[2rem] blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`}
      ></div>

      {/* 2. CARD CONTAINER UTAMA */}
      <div className="relative bg-black rounded-[1.8rem] p-1 h-full">
        <div className="bg-neutral-900/90 h-full w-full rounded-[1.6rem] p-6 flex flex-col justify-between overflow-hidden relative backdrop-blur-sm">
            
            {/* Background Texture/Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* HEADER: Level Badge & Address */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div className={`px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md ${shadowColor} shadow-lg`}>
                    <span className={`text-xs font-black tracking-widest uppercase bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                        {level}
                    </span>
                </div>
                <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                    <Address address={data.address as `0x${string}`} className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-1 rounded-md" />
                </div>
            </div>

            {/* MAIN CONTENT: Grid Layout (Avatar Left, Score Right) */}
            <div className="grid grid-cols-[auto_1fr] gap-6 items-center mb-8 z-10">
                
                {/* Avatar Section */}
                <div className="relative">
                    <div className={`absolute -inset-2 rounded-full blur-md opacity-40 bg-gradient-to-tr ${accentGradient}`}></div>
                    <Identity 
                        address={data.address as `0x${string}`} 
                        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                    >
                        <Avatar className={`h-20 w-20 ring-2 ${ringColor} bg-black shadow-2xl relative z-10`} />
                    </Identity>
                </div>

                {/* Name & Score Section */}
                <div className="flex flex-col items-end text-right">
                    <div className="text-sm font-medium text-neutral-400 mb-1">Total Score</div>
                    <div className={`text-6xl font-black tracking-tighter leading-none ${textColor} drop-shadow-2xl`}>
                        {totalScore}
                    </div>
                    
                    <div className="mt-2 font-bold text-lg text-white truncate max-w-[160px]">
                        {data.resolvedName ? (
                        <span>{data.resolvedName}</span>
                        ) : (
                        <Name address={data.address as `0x${string}`} className="text-white" />
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER: Badges Area */}
            <div className="relative z-10">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-4"></div>
                
                <div className="flex flex-wrap gap-2">
                    {badges.length > 0 ? badges.map((badge, i) => (
                        <span 
                            key={i} 
                            className="px-2 py-1 bg-neutral-800/80 border border-white/5 rounded text-[10px] text-neutral-300 font-medium hover:border-white/20 hover:bg-neutral-700 transition cursor-help"
                        >
                            {badge}
                        </span>
                    )) : (
                        <span className="text-xs text-neutral-600 font-mono w-full text-center py-2">No achievements unlocked</span>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
