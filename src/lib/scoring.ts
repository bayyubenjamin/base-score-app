// src/lib/scoring.ts

export type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
  gasUsed: string;
};

export type UserStats = {
  address: string;
  basename?: string | null;
  ethBalance: number;
  txCount: number;
  nftCount: number;
  joinDate: string;
  // Field Baru
  history: Transaction[]; 
  totalGasUsed: number; 
};

export type ScoreResult = {
  totalScore: number;
  level: string;
  badges: string[];
};

export function calculateScore(stats: UserStats): ScoreResult {
  let score = 0;
  const badges: string[] = [];

  // 1. Identity (Basename)
  if (stats.basename) {
    score += 25;
    badges.push("🏷️ Base OG");
  }

  // 2. Transaction Activity
  if (stats.txCount >= 500) {
    score += 40;
    badges.push("⚡ Power User");
  } else if (stats.txCount >= 100) {
    score += 25;
    badges.push("🔥 Active");
  } else if (stats.txCount >= 10) {
    score += 10;
  }

  // 3. Wealth (Balance)
  if (stats.ethBalance >= 1.0) {
    score += 35;
    badges.push("🐳 Whale");
  } else if (stats.ethBalance >= 0.1) {
    score += 20;
    badges.push("💰 Holder");
  } else if (stats.ethBalance >= 0.01) {
    score += 10;
  }

  // 4. Loyalty (Wallet Age)
  const daysOld = (new Date().getTime() - new Date(stats.joinDate).getTime()) / (1000 * 3600 * 24);
  if (daysOld > 180) { 
      score += 5; 
      badges.push("👴 Veteran");
  }

  // Level Logic
  let level = "Newbie";
  if (score >= 90) level = "Based God";
  else if (score >= 60) level = "Crypto Native";
  else if (score >= 30) level = "Explorer";

  return { totalScore: Math.min(score, 100), level, badges };
}
