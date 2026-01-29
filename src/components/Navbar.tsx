'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useProfile } from '@farcaster/auth-kit';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Navbar({ onOpenModal }: { onOpenModal: () => void }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { profile: fcProfile, isAuthenticated: isFcAuth } = useProfile();

  const isLoggedIn = isConnected || isFcAuth;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-white/5 bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Base Score
          </span>
        </div>

        {/* Actions */}
        <div>
          {!isLoggedIn ? (
            <button 
              onClick={onOpenModal}
              className="glass-button bg-primary/80 hover:bg-primary text-white border-none shadow-lg shadow-primary/20"
            >
              Connect ID
            </button>
          ) : (
            <div className="flex items-center gap-3 p-1 pr-2 glass-card rounded-full border-primary/30">
               {/* User Identifier */}
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
                  {isFcAuth && fcProfile?.pfpUrl ? (
                    <Image src={fcProfile.pfpUrl} width={24} height={24} alt={fcProfile.username || 'User'} className="rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-main"></div>
                  )}
                  <span className="text-sm font-medium text-gray-200">
                    {isFcAuth ? `@${fcProfile?.username}` : address ? `${address.slice(0,6)}...` : 'User'}
                  </span>
               </div>

               {/* Logout button */}
               <button onClick={() => disconnect()} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
               </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
