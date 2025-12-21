// src/app/api/score/route.ts
import { NextResponse } from "next/server";
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { base } from "viem/chains";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(config);

// Client Viem untuk resolusi Basename
const publicClient = createPublicClient({
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
    // 1. Resolusi Basename / ENS jika input bukan address 0x
    if (!isAddress(query)) {
      const nameToResolve = query.includes(".") ? query : `${query}.base.eth`;
      const resolved = await publicClient.getEnsAddress({ name: nameToResolve });
      
      if (resolved) {
        address = resolved;
        resolvedName = nameToResolve;
      } else {
        return NextResponse.json({ error: "Basename not found" }, { status: 404 });
      }
    } else {
      // Jika input adalah address, coba cari Reverse Record
      const name = await publicClient.getEnsName({ address: query as `0x${string}` });
      if (name) resolvedName = name;
    }

    // 2. Fetch Data Paralel dari Alchemy
    const [
      balanceWei, 
      nfts, 
      txCount, 
      firstTx,
      recentTx
    ] = await Promise.all([
      // Get Native Balance (ETH)
      alchemy.core.getBalance(address),
      
      // Get NFT Count
      alchemy.nft.getNftsForOwner(address),
      
      // Get Transaction Count (Nonce)
      alchemy.core.getTransactionCount(address),

      // Get First Transaction (Untuk Join Date)
      alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL],
        order: SortingOrder.ASCENDING,
        maxCount: 1,
        withMetadata: true 
      }),

      // Get Recent Transactions (Untuk History)
      alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20],
        order: SortingOrder.DESCENDING,
        maxCount: 20,
        withMetadata: true 
      })
    ]);

    // Format Data
    const ethBalance = formatEther(BigInt(balanceWei.toString()));
    
    // Tentukan Join Date
    let joinDate = new Date().toISOString();
    // TypeScript sekarang mengenali metadata karena withMetadata: true digunakan
    if (firstTx.transfers.length > 0 && firstTx.transfers[0].metadata?.blockTimestamp) {
        joinDate = firstTx.transfers[0].metadata.blockTimestamp;
    }

    // Format History untuk Frontend
    const history = recentTx.transfers.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "",
        value: tx.value?.toString() || "0",
        asset: tx.asset || "ETH",
        blockNum: tx.blockNum
    }));

    return NextResponse.json({
      address,
      resolvedName,
      ethBalance, 
      tokenCount: 0, 
      nftCount: nfts.totalCount,
      txCount: txCount,
      joinDate: joinDate,
      history: history,
      // Default "0" string untuk menghindari error kalkulasi
      totalGasUsed: "0" 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch onchain data" }, { status: 500 });
  }
}
