import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Wine,
  BellRing,
  Receipt,
  ShieldCheck
} from 'lucide-react';

export const NotificationBanner: React.FC = () => {
  const { activeNotification, dismissNotification, setIsStaffModalOpen, isStaffLoggedIn } = useApp();

  // Auto-dismiss the active notification after 8 seconds
  useEffect(() => {
    if (!activeNotification || !isStaffLoggedIn) return;
    const timer = setTimeout(() => {
      dismissNotification();
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeNotification, isStaffLoggedIn, dismissNotification]);

  // CRITICAL REQUIREMENT: Notifications must ONLY be seen by logged-in staff!
  // Once staff logs out, no notifications popping!
  if (!isStaffLoggedIn || !activeNotification) {
    return null;
  }

  const openTerminal = () => {
    dismissNotification();
    setIsStaffModalOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 350 }}
        className="fixed top-3 inset-x-3 sm:top-5 sm:inset-x-auto sm:right-6 sm:max-w-md z-[120] pointer-events-auto"
      >
        <div className="relative rounded-3xl p-4 sm:p-5 glass-panel border-2 border-amber-400 shadow-[0_12px_45px_rgba(0,0,0,0.92)] bg-gradient-to-br from-[#1a110a] via-[#100b08] to-black backdrop-blur-2xl overflow-hidden">
          {/* Golden shimmer beacon flare */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/25 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/40">
              {activeNotification.type === 'purchase' ? (
                <Wine className="w-5 h-5 fill-black stroke-black" />
              ) : (
                <BellRing className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>STAFF ALERT · NEW ORDER</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              </div>

              <h4 className="font-serif-luxe text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
                {activeNotification.title}
              </h4>

              <p className="text-xs text-amber-100/90 mt-1 leading-relaxed font-sans">
                {activeNotification.message}
              </p>

              {/* Action Buttons: Designed for quick phone tapping */}
              <div className="mt-3.5 pt-2.5 border-t border-amber-500/25 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={openTerminal}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Open Staff Terminal</span>
                </button>

                <button
                  type="button"
                  onClick={dismissNotification}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Top right dismiss X */}
            <button
              type="button"
              onClick={dismissNotification}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-amber-300/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: 'linear' }}
            className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
