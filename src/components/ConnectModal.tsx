import { X, Smartphone, QrCode, Wallet, ChevronRight } from 'lucide-react';
import { Connector } from 'wagmi';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectors: readonly Connector[];
  connect: (args: { connector: Connector }) => void;
}

export function ConnectModal({ isOpen, onClose, connectors, connect }: ConnectModalProps) {
  if (!isOpen) return null;

  // Mencari connector yang tepat
  const walletConnectItem = connectors.find((c) => c.id === 'walletConnect');
  const coinbaseItem = connectors.find((c) => c.id === 'coinbaseWalletSDK');

  const handleConnect = (connector?: Connector) => {
    if (connector) {
      connect({ connector });
      onClose();
    } else {
      // Fallback cerdas: Jika connector spesifik tidak ketemu, pakai yang pertama
      // Ini mengatasi masalah "tombol tidak bisa diklik"
      const firstAvailable = connectors[0];
      if (firstAvailable) {
        connect({ connector: firstAvailable });
        onClose();
      } else {
        alert("No wallet connectors found. Please check configuration.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop dengan Blur Kuat & Animasi Masuk */}
      <div 
        className="absolute inset-0 bg-[#050505]/60 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Kontainer Modal Emboss */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a1f2e] to-[#0B0E14] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 transform transition-all group">
        
        {/* Efek Lighting Top Border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Connect Wallet</h2>
            <p className="text-gray-400 text-sm mt-1">Choose your preferred gateway</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pilihan Wallet */}
        <div className="p-6 space-y-4">
          
          {/* Option 1: WalletConnect (UTAMA) */}
          <button
            onClick={() => handleConnect(walletConnectItem)}
            className="w-full relative group overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {/* Gradient Border Animasi */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 group-hover:opacity-100 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            
            {/* Inner Content */}
            <div className="relative h-full bg-[#151a25] group-hover:bg-[#1a202e] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300">
               <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="text-white" size={26} />
               </div>
               <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">WalletConnect</h3>
                  <p className="text-xs text-gray-400">Scan QR with MetaMask, Rainbow, Trust</p>
               </div>
               <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Option 2: Base Smart Wallet */}
          <button
            onClick={() => handleConnect(coinbaseItem)}
            className="w-full group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-4 flex items-center gap-4 text-left transition-all hover:border-white/10"
          >
            <div className="w-14 h-14 rounded-xl bg-[#0052FF] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Smartphone className="text-white" size={26} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Smart Wallet</h3>
              <p className="text-xs text-gray-400">Powered by Coinbase & Passkeys</p>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="p-6 pt-2 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <Wallet size={10} />
                Secured by OnchainKit
            </div>
        </div>
      </div>
    </div>
  );
}
