// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { Alchemy, Network, AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from 'viem/ens';

// Pastikan API Key ada
if (!process.env.ALCHEMY_API_KEY) {
  console.error("❌ MISSING ALCHEMY_API_KEY");
}

const apiKey = process.env.ALCHEMY_API_KEY;

// 1. Config Alchemy untuk Data Transaksi (Base Mainnet)
const config = {
  apiKey: apiKey,
  network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(config);

// 2. Client Khusus untuk Resolusi ENS/Basename (WAJIB Mainnet)
// Basename hidup di L1 (Ethereum Mainnet) via CCIP-Read
const ensClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("address");

  if (!query) {
    return NextResponse.json({ error: "Address or Basename is required" }, { status: 400 });
  }

  let address = query;
  let resolvedName: string | null = null;

  try {
    // --- TAHAP 1: RESOLUSI ADDRESS/BASENAME ---
    if (!isAddress(query)) {
      console.log(`🔍 Resolving Basename: ${query} on Mainnet...`);
      
      let nameToResolve = query.toLowerCase();
      if (!nameToResolve.includes(".")) {
        nameToResolve = `${nameToResolve}.base.eth`;
      }

      try {
        // Normalisasi nama agar sesuai standar ENS (menghindari error karakter aneh)
        const normalizedName = normalize(nameToResolve);
        
        // Resolve address dari nama
        const resolved = await ensClient.getEnsAddress({ 
          name: normalizedName 
        });

        if (resolved) {
          address = resolved;
          resolvedName = nameToResolve;
          console.log(`✅ Resolved: ${nameToResolve} -> ${address}`);
        } else {
          console.warn(`⚠️ Basename not found: ${nameToResolve}`);
          return NextResponse.json({ error: "Basename/ENS not found" }, { status: 404 });
        }
      } catch (ensError) {
        console.error("❌ ENS Resolution Error:", ensError);
        return NextResponse.json({ error: "Invalid name format or Resolver Error" }, { status: 400 });
      }
    } else {
      // Jika input adalah address, coba cari Reverse Record (Opsional, tidak wajib sukses)
      try {
        const name = await ensClient.getEnsName({ address: query as `0x${string}` });
        if (name) resolvedName = name;
      } catch (e) {
        // Ignore error reverse lookup
      }
    }

    // --- TAHAP 2: AMBIL DATA ONCHAIN (BASE MAINNET) ---
    console.log(`📊 Fetching Base data for: ${address}`);

    const [
      balanceWei, 
      nfts, 
      txCount, 
      tokenBalances, 
      firstTx,
      recentTx
    ] = await Promise.all([
      alchemy.core.getBalance(address),
      alchemy.nft.getNftsForOwner(address),
      alchemy.core.getTransactionCount(address),
      alchemy.core.getTokenBalances(address),
      alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: [AssetTransfersCategory.EXTERNAL],
        order: SortingOrder.ASCENDING,
        maxCount: 1,
        withMetadata: true 
      }),
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
    
    // Hitung Token Count dengan Safety Check
    // Kadang alchemy mengembalikan tokenBalance null atau error hex
    const activeTokenCount = tokenBalances.tokenBalances.filter(t => {
      try {
        return t.tokenBalance && t.tokenBalance !== "0x" && BigInt(t.tokenBalance) > 0;
      } catch {
        return false;
      }
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

    return NextResponse.json({
      address,
      resolvedName,
      ethBalance, 
      tokenCount: activeTokenCount,
      nftCount: nfts.totalCount,
      txCount: txCount,
      joinDate: joinDate,
      history: history,
      totalGasUsed: "0" 
    });

  } catch (error: any) {
    // Log error detail ke terminal server agar kamu bisa debug
    console.error("🔥 API CRITICAL ERROR:", error);
    
    // Kembalikan pesan error spesifik jika dari Alchemy
    const errorMessage = error?.body ? JSON.parse(error.body).message : "Failed to fetch onchain data";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
