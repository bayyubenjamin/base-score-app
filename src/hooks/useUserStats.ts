import { useQuery } from '@tanstack/react-query';
import { UserStats } from '@/lib/scoring';

// Fungsi fetcher terpisah
const fetchUserData = async (address: string): Promise<UserStats> => {
  if (!address) throw new Error("Address is required");
  
  const response = await fetch(`/api/user?address=${address}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Gagal mengambil data wallet.");
  }

  // Normalisasi data sebelum masuk ke komponen
  return {
    ...result,
    resolvedName: result.resolvedName || (address.includes('.') ? address : null)
  };
};

export const useUserStats = (address: string | undefined, isConnected: boolean) => {
  return useQuery({
    queryKey: ['userStats', address], // Cache key unik berdasarkan address
    queryFn: () => fetchUserData(address!),
    enabled: isConnected && !!address, // Hanya fetch jika wallet connect & ada address
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit (Cache)
    retry: 1, // Coba ulang 1x jika gagal
  });
};
