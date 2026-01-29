import { useState, useEffect } from 'react';
import { X, Smartphone, QrCode, Wallet, ChevronRight, ArrowLeft } from 'lucide-react';
import { Connector } from 'wagmi';
import { useSignIn } from '@farcaster/auth-kit';
import { QRCodeSVG } from 'qrcode.react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectors: readonly Connector[];
  connect: (args: { connector: Connector }) => void;
}

export function ConnectModal({ isOpen, onClose, connectors, connect }: ConnectModalProps) {
  // State untuk mengatur tampilan modal (list menu atau scan QR Farcaster)
  const [view, setView] = useState<'list' | 'farcaster'>('list');
  
  // Hook Farcaster
  const { signIn, url: farcasterUrl, data: farcasterData, isSuccess: isFarcasterSuccess } = useSignIn();

  // Reset view saat modal ditutup/dibuka
  useEffect(() => {
    if (isOpen) setView('list');
  }, [isOpen]);

  // Handle sukses login Farcaster
  useEffect(() => {
    if (isFarcasterSuccess && farcasterData) {
      console.log("Farcaster Login Success:", farcasterData);
      onClose();
    }
  }, [isFarcasterSuccess, farcasterData, onClose]);

  if (!isOpen) return null;

  // Filter connectors
  const walletConnectItem = connectors.find((c) => c.id === 'walletConnect');
  const coinbaseItem = connectors.find((c) => c.id === 'coinbaseWalletSDK');

  const handleConnect = (connector?: Connector) => {
    if (connector) {
      connect({ connector });
      onClose();
    } else {
      const firstAvailable = connectors[0];
      if (firstAvailable) {
        connect({ connector: firstAvailable });
        onClose();
      }
    }
  };

  const handleFarcasterClick = () => {
    setView('farcaster');
    signIn(); // Generate QR Code baru
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050505]/60 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a1f2e] to-[#0B0E14] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 transform transition-all">
        
        {/* Lighting Effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

        {/* Header Dynamic */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            {view === 'farcaster' ? (
               <button 
                onClick={() => setView('list')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 text-sm font-bold uppercase tracking-wider"
               >
                 <ArrowLeft size={14} /> Back
               </button>
            ) : (
               <h2 className="text-2xl font-black text-white tracking-tight">Connect</h2>
            )}
            <p className="text-gray-400 text-sm">
              {view === 'farcaster' ? 'Scan with Warpcast' : 'Choose your gateway'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 pt-2 space-y-3 min-h-[300px]">
          
          {/* VIEW 1: LIST MENU */}
          {view === 'list' && (
            <>
              {/* Option 1: Farcaster (Highlight) */}
              <button
                onClick={handleFarcasterClick}
                className="w-full group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-20 group-hover:opacity-100 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <div className="relative h-full bg-[#151a25] group-hover:bg-[#1a202e] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 border border-white/5">
                   <div className="w-12 h-12 rounded-xl bg-[#855DCD] flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                      {/* Logo Farcaster Sederhana */}
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.24.24H5.76A5.76 5.76 0 0 0 0 6v12a5.76 5.76 0 0 0 5.76 5.76h12.48A5.76 5.76 0 0 0 24 18V6A5.76 5.76 0 0 0 18.24.24m.816 17.166v.504a.49.49 0 0 1 .543.48v.588a.504.504 0 0 1-.504.504H14.406v-7.308l-.006 7.308H9.606v-7.308l-.006 7.308H4.902a.504.504 0 0 1-.504-.504v-.588a.49.49 0 0 1 .543-.48v-.504a1.008 1.008 0 0 1 1.008-1.008h12.102a1.008 1.008 0 0 1 1.008 1.008h-.006z"/>
                      </svg>
                   </div>
                   <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Farcaster</h3>
                      <p className="text-xs text-gray-400">Login with Warpcast</p>
                   </div>
                   <ChevronRight className="text-gray-600 group-hover:text-white" />
                </div>
              </button>

              <div className="flex items-center gap-4 my-2">
                 <div className="h-px bg-white/10 flex-1"></div>
                 <span className="text-[10px] text-gray-500 font-bold uppercase">OR</span>
                 <div className="h-px bg-white/10 flex-1"></div>
              </div>

              {/* Option 2: Smart Wallet */}
              <button
                onClick={() => handleConnect(coinbaseItem)}
                className="w-full group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0052FF] flex items-center justify-center shrink-0">
                  <Smartphone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Smart Wallet</h3>
                  <p className="text-xs text-gray-400">Passkeys & Social Login</p>
                </div>
              </button>

              {/* Option 3: WalletConnect */}
              <button
                onClick={() => handleConnect(walletConnectItem)}
                className="w-full group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3B99FC] flex items-center justify-center shrink-0">
                  <QrCode className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">WalletConnect</h3>
                  <p className="text-xs text-gray-400">Metamask, Rainbow, Trust</p>
                </div>
              </button>
            </>
          )}

          {/* VIEW 2: FARCASTER QR SCAN */}
          {view === 'farcaster' && (
             <div className="flex flex-col items-center justify-center animate-in slide-in-from-right duration-300">
                <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_-10px_rgba(133,93,205,0.5)] mb-6">
                   {farcasterUrl ? (
                      <QRCodeSVG value={farcasterUrl} size={220} />
                   ) : (
                      <div className="w-[220px] h-[220px] bg-gray-100 rounded-xl flex items-center justify-center">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                   )}
                </div>
                
                <p className="text-center text-sm text-gray-300 max-w-[80%] leading-relaxed">
                   Open <strong className="text-purple-400">Warpcast</strong> on your phone <br/>
                   Go to Settings &gt; Connected Apps &gt; Scan QR
                </p>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 text-center bg-black/20">
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <Wallet size={10} />
                Secured by OnchainKit & AuthKit
            </div>
        </div>
      </div>
    </div>
  );
}
