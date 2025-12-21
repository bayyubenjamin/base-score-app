import { NextResponse } from "next/server";
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY, // Mengambil dari .env.local
  network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(config);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    // Mengambil data paralel agar lebih cepat
    const [balances, nfts, txCount] = await Promise.all([
      alchemy.core.getTokenBalances(address),
      alchemy.nft.getNftsForOwner(address),
      alchemy.core.getTransactionCount(address),
    ]);

    // Format data untuk dikembalikan ke frontend
    return NextResponse.json({
      address,
      tokenCount: balances.tokenBalances.length,
      nftCount: nfts.totalCount,
      txCount: txCount,
      // Tambahkan data lain yang diperlukan oleh UserStats di frontend
      joinDate: new Date().toISOString(), // Mock, karena Alchemy SDK butuh logika khusus untuk first tx
      totalGasUsed: 0, // Perlu kalkulasi lebih dalam jika ingin data real
      history: [] // Bisa diisi dengan alchemy.core.getAssetTransfers jika perlu
    });

  } catch (error) {
    console.error("Alchemy Error:", error);
    return NextResponse.json({ error: "Failed to fetch onchain data" }, { status: 500 });
  }
}
