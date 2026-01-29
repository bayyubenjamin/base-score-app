'use client';

import React, { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { SignInButton } from '@farcaster/auth-kit';
import { XMarkIcon, WalletIcon, QrCodeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const { connectors, connect } = useConnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !isOpen) return null;

  const injectedConnector = connectors.find((c) => c.id === 'injected');
  const wcConnector = connectors.find((c) => c.id === 'walletConnect');
  const cbConnector = connectors.find((c) => c.id === 'coinbaseWalletSDK');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Sign In</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700 transition text-slate-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Farcaster Section */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider text-center">Social Identity</p>
          <div className="flex justify-center w-full">
             <SignInButton onSuccess={onClose} />
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold">OR WALLET</span>
            <div className="flex-grow border-t border-slate-700"></div>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3">
          {cbConnector && (
            <button onClick={() => { connect({ connector: cbConnector }); onClose(); }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <WalletIcon className="w-4 h-4" />
                 </div>
                 <span className="font-semibold text-white">Coinbase Smart Wallet</span>
              </div>
               <ArrowTopRightOnSquareIcon className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
            </button>
          )}

          {injectedConnector && (
            <button onClick={() => { connect({ connector: injectedConnector }); onClose(); }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-orange-500 hover:bg-slate-700 transition group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">
                    <WalletIcon className="w-4 h-4" />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="font-semibold text-white">Browser Wallet</span>
                    <span className="text-xs text-slate-400 font-normal">MetaMask, Rabby, etc</span>
                 </div>
              </div>
              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
            </button>
          )}

          {wcConnector && (
            <button onClick={() => { connect({ connector: wcConnector }); onClose(); }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-400 hover:bg-slate-700 transition group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center text-blue-400">
                    <QrCodeIcon className="w-4 h-4" />
                 </div>
                 <span className="font-semibold text-white">WalletConnect (QR)</span>
              </div>
              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
