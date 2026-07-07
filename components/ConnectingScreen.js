'use client';

import { useEffect } from 'react';

export default function ConnectingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 gap-6">
      <div className="relative flex items-center justify-center w-20 h-20">
        <span className="absolute inset-0 rounded-full border-2 border-navy/40 animate-pulseRing" />
        <span className="absolute inset-0 rounded-full border-2 border-navy/40 animate-pulseRing [animation-delay:0.6s]" />
        <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center">
          <span className="font-display text-paper text-sm font-semibold">AC</span>
        </div>
      </div>
      <p className="text-ink font-medium text-[15px] text-center">
        Conectando con un ejecutivo...
      </p>
      <p className="text-slate text-sm text-center max-w-[220px]">
        En unos segundos podrás elegir con quién hablar.
      </p>
    </div>
  );
}
