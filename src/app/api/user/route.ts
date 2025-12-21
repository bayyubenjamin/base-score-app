import { NextResponse } from "next/server";
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { base, mainnet } from "viem/chains"; // Tambahkan mainnet untuk ENS
import { normalize } from 'viem/ens'; // Untuk normalisasi nama ENS

// 1. Config Alchemy untuk Data Transaksi (Base Mainnet)
const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(config);

// 2. Client Khusus untuk Resolusi ENS/Basename (WAJIB Mainnet)
// Basename sebenarnya adalah ENS, dan registry-nya ada di L1 (Mainnet)
const ensClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
});

// 3. Client untuk Base (jika perlu interaksi spesifik chain Base)
const baseClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("address");

  if (!query) {
    return NextResponse.json({ error: "Address or Basename is required" }, { status: 400 });
  }

  let address = query;
  let resolvedName = null;

  try {
    // --- TAHAP 1: RESOLUSI ADDRESS/BASENAME ---
    
    if (!isAddress(query)) {
      // Jika input bukan address (misal: "jesse" atau "jesse.base.eth")
      let nameToResolve = query.toLowerCase();
      
      // Jika user hanya ketik "jesse", tambahkan suffix
      if (!nameToResolve.includes(".")) {
        nameToResolve = `${nameToResolve}.base.eth`;
      }
      
      try {
        // Resolve menggunakan Mainnet Client
        const resolved = await ensClient.getEnsAddress({ 
          name: normalize(nameToResolve) 
        });
        
        if (resolved) {
          address = resolved;
          resolvedName = nameToResolve;
        } else {
          return NextResponse.json({ error: "Basename not found" }, { status: 404 });
        }
      } catch (err) {
        console.error("ENS Resolution Error:", err);
        return NextResponse.json({ error: "Error resolving name" }, { status: 404 });
      }
    } else {
      // Jika input adalah address, coba cari Reverse Record (Opsional)
      try {
        const name = await ensClient.getEnsName({ address: query as `0x${string}` });
        if (name) resolvedName = name;
      } catch (e) {
        // Ignore error jika reverse lookup gagal
      }
    }

    // --- TAHAP 2: AMBIL DATA ONCHAIN (PARALEL) ---
    
    const [
      balanceWei, 
      nfts, 
      txCount, 
      tokenBalances, // Fetch saldo token
      firstTx,
      recentTx
    ] = await Promise.all([
      // 1. Native Balance (ETH)
      alchemy.core.getBalance(address),
      
      // 2. NFT Count
      alchemy.nft.getNftsForOwner(address),
      
      // 3. Transaction Count (Nonce)
      alchemy.core.getTransactionCount(address),

      // 4. Token Balances (Untuk mengisi tokenCount)
      alchemy.core.getTokenBalances(address),

      // 5. First Transaction (Untuk Join Date)
      alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL],
        order: SortingOrder.ASCENDING,
        maxCount: 1,
        withMetadata: true 
      }),

      // 6. Recent Transactions (Untuk History & Gas Estimation sampel)
      alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20],
        order: SortingOrder.DESCENDING,
        maxCount: 20,
        withMetadata: true 
      })
    ]);

    // --- TAHAP 3: FORMAT DATA ---

    // Format ETH Balance
    const ethBalance = formatEther(BigInt(balanceWei.toString()));
    
    // Hitung Token Count (hanya yang saldonya > 0)
    const activeTokenCount = tokenBalances.tokenBalances.filter(t => {
      // Cek hex string balance, pastikan valid dan > 0
      return t.tokenBalance && t.tokenBalance !== "0x" && BigInt(t.tokenBalance) > 0;
    }).length;

    // Tentukan Join Date
    let joinDate = new Date().toISOString();
    if (firstTx.transfers.length > 0 && firstTx.transfers[0].metadata?.blockTimestamp) {
        joinDate = firstTx.transfers[0].metadata.blockTimestamp;
    }

    // Format History
    const history = recentTx.transfers.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "",
        value: tx.value?.toString() || "0",
        asset: tx.asset || "Unknown",
        blockNum: tx.blockNum
    }));

    // Estimasi Gas (Opsional: Tetap "0" jika tidak punya data gas onchain yang akurat)
    // Untuk mendapatkan total gas akurat perlu indexer berbayar atau loop ribuan tx.
    // Kita biarkan "0" atau hitung sampel kecil jika mau, tapi "0" lebih aman agar cepat.
    const totalGasUsed = "0"; 

    return NextResponse.json({
      address,
      resolvedName, // Mengembalikan nama yang ditemukan (misal jesse.base.eth)
      ethBalance, 
      tokenCount: activeTokenCount, // Data token sekarang dinamis
      nftCount: nfts.totalCount,
      txCount: txCount,
      joinDate: joinDate,
      history: history,
      totalGasUsed
    });

  } catch (error) {
    console.error("API General Error:", error);
    return NextResponse.json({ error: "Failed to fetch onchain data" }, { status: 500 });
  }
}
