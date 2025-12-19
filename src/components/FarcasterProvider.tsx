'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Memberitahu Farcaster bahwa frame sudah siap dirender
      try {
        await sdk.actions.ready();
      } catch (err) {
        console.error("Farcaster SDK Error:", err);
      }
      setIsSDKLoaded(true);
    };
    
    // Panggil load jika belum loaded
    if (sdk && !isSDKLoaded) {
      load();
    }
  }, [isSDKLoaded]);

  return <>{children}</>;
}
