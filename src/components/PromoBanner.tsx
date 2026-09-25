import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { promo, updatePromoBanner } = useApp();

  if (!promo.isActive) return null;

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-40 bg-gradient-to-r from-amber-950/80 via-black/90 to-amber-950/80 border-b border-amber-500/30 backdrop-blur-md px-4 py-2.5 text-xs text-amber-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            {promo.tag}
          </span>
          <p className="font-medium tracking-wide text-amber-100/90 text-xs sm:text-sm">
            {promo.message}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
          <button
            onClick={scrollToBooking}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors py-1 px-2.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
          >
            <span>{promo.ctaText || 'Inquire Now'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => updatePromoBanner({ isActive: false })}
            title="Dismiss notification"
            className="p-1 text-amber-400/60 hover:text-amber-200 transition-colors rounded hover:bg-white/5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
