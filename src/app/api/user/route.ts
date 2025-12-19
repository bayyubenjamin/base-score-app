// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { createPublicClient, http, isAddress, formatEther } from "viem";
import { base } from "viem/chains";
import { normalize } from 'viem/ens';

const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;

// Setup Client Viem
const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://mainnet.base.org`),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("address");

  if (!query) return NextResponse.json({ error: "Input kosong" }, { status: 400 });

  try {
    let targetAddress = query;
    let resolvedName = null;

    // --- 1. RESOLUSI ADDRESS/NAME ---
    if (isAddress(query)) {
      targetAddress = query;
      try {
        const name = await publicClient.getEnsName({ address: targetAddress as `0x${string}` });
        if (name) resolvedName = name;
      } catch (e) {}
    } else if (query.includes(".")) {
      try {
        const address = await publicClient.getEnsAddress({ name: normalize(query) });
        if (!address) return NextResponse.json({ error: "Nama tidak ditemukan" }, { status: 404 });
        targetAddress = address;
        resolvedName = query;
      } catch (err) {
        return NextResponse.json({ error: "Gagal resolve nama" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Format tidak valid" }, { status: 400 });
    }

    // --- 2. FETCH DATA PRESISI ---
    let ethBalance = 0;
    let txCount = 0;
    let firstTxDate = new Date().toISOString();
    let history: any[] = [];
    let totalGasPaidWei = BigInt(0); // Gunakan BigInt untuk presisi

    const baseUrl = "https://api.basescan.org/api";
    
    try {
      // KITA LAKUKAN 3 REQUEST PARALEL KE BASESCAN:
      // 1. Balance & Recent History (untuk display list & gas calculation sample)
      // 2. First Transaction (untuk Wallet Age yang AKURAT)
      
      const [balanceRes, recentTxRes, firstTxRes] = await Promise.all([
        // Req 1: Balance
        fetch(`${baseUrl}?module=account&action=balance&address=${targetAddress}&tag=latest&apikey=${BASESCAN_API_KEY}`).then(r => r.json()),
        // Req 2: 50 Transaksi Terakhir (Desc)
        fetch(`${baseUrl}?module=account&action=txlist&address=${targetAddress}&page=1&offset=50&sort=desc&apikey=${BASESCAN_API_KEY}`).then(r => r.json()),
        // Req 3: 1 Transaksi PERTAMA (Asc) -> KUNCI UNTUK WALLET AGE
        fetch(`${baseUrl}?module=account&action=txlist&address=${targetAddress}&page=1&offset=1&sort=asc&apikey=${BASESCAN_API_KEY}`).then(r => r.json())
      ]);

      // Parse Balance
      if (balanceRes.status === "1") {
        ethBalance = parseFloat((parseInt(balanceRes.result) / 1e18).toFixed(5)); // 5 decimal biar kelihatan
      } else {
        throw new Error("BaseScan Limit/Error");
      }

      // Parse History Terbaru (Display & Gas Sample)
      if (recentTxRes.status === "1" && Array.isArray(recentTxRes.result)) {
        const txs = recentTxRes.result;
        
        // Ambil 10 teratas untuk UI
        history = txs.slice(0, 10).map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: formatEther(BigInt(tx.value)),
            timeStamp: tx.timeStamp,
            isError: tx.isError,
        }));

        // Hitung Gas Burned (Sample 50 tx terakhir)
        // Rumus: GasUsed * GasPrice
        txs.forEach((tx: any) => {
            const gasUsed = BigInt(tx.gasUsed);
            const gasPrice = BigInt(tx.gasPrice || 0);
            totalGasPaidWei += (gasUsed * gasPrice);
        });
      }

      // Parse Wallet Age (Dari request ke-3)
      if (firstTxRes.status === "1" && Array.isArray(firstTxRes.result) && firstTxRes.result.length > 0) {
        // Ambil timestamp transaksi pertama kali user main di Base
        const firstTxTimestamp = parseInt(firstTxRes.result[0].timeStamp);
        firstTxDate = new Date(firstTxTimestamp * 1000).toISOString();
      }

      // Parse Total Tx Count (Kita bisa estimasi dari nonce via RPC agar cepat & gratis)
      // BaseScan tidak return total count di endpoint txlist, jadi kita pakai RPC count
      const nonce = await publicClient.getTransactionCount({ address: targetAddress as `0x${string}` });
      txCount = nonce;

    } catch (apiError) {
      console.warn("BaseScan Error, fallback mode.", apiError);
      // Fallback
      const [bal, nonce] = await Promise.all([
        publicClient.getBalance({ address: targetAddress as `0x${string}` }),
        publicClient.getTransactionCount({ address: targetAddress as `0x${string}` })
      ]);
      ethBalance = parseFloat(formatEther(bal));
      txCount = nonce;
    }

    // Format Gas ke String ETH
    const totalGasEth = parseFloat(formatEther(totalGasPaidWei));

    return NextResponse.json({
      address: targetAddress,
      basename: resolvedName, 
      ethBalance,
      txCount, 
      nftCount: 0,
      joinDate: firstTxDate,
      history,      
      totalGasUsed: totalGasEth // Kirim dalam format ETH (float)
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
