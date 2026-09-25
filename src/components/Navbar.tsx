import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, ShieldCheck, Star, Sparkles, Phone, MapPin, Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    toggleAbout,
    setIsStaffModalOpen,
    setIsFeedbackModalOpen,
    isStaffLoggedIn,
    settings,
    notifications
  } = useApp();

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    if (sectionId === 'about') {
      toggleAbout();
      return;
    }
    if (sectionId === 'staff') {
      setIsStaffModalOpen(true);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top Left Corner: exact text "muko luxe_ concierge" */}
          <div className="flex items-center gap-3">
            <a
              href="#intro-section"
              className="group flex items-center gap-2 text-decoration-none"
            >
              <div className="w-8 h-8 rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-black/60 flex items-center justify-center shadow-inner">
                <span className="font-serif-luxe text-amber-300 text-sm font-bold">M</span>
              </div>
              <span className="font-serif-luxe text-base sm:text-lg tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors uppercase font-medium">
                muko luxe_ concierge
              </span>
            </a>

            {isStaffLoggedIn && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Staff Authenticated
              </span>
            )}
          </div>

          {/* Top Right: Three lines burger menu icon & notification bell (Staff Only) */}
          <div className="flex items-center gap-2">
            {/* VIP Notification Activity Bell - Only visible when staff is logged in */}
            {isStaffLoggedIn && (
              <button
                onClick={() => setIsStaffModalOpen(true)}
                title="Recent VIP Bookings & Concierge Notifications"
                className="relative flex items-center justify-center w-11 h-11 rounded-lg border border-amber-500/30 bg-black/40 hover:bg-amber-950/40 text-amber-300 hover:text-white transition-all cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-bold font-mono flex items-center justify-center shadow-lg animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-200/90 hover:text-amber-100 rounded-lg border border-amber-500/20 hover:border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Event Feedback</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              className="flex items-center justify-center w-11 h-11 rounded-lg border border-amber-500/30 bg-black/40 hover:bg-amber-950/40 text-amber-200 hover:text-amber-100 hover:border-amber-400/60 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-amber-300" />
              ) : (
                <Menu className="w-6 h-6 text-amber-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Burger Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex justify-end"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#0d0a08]/95 border-l border-amber-500/20 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-amber-500/15">
                  <div>
                    <span className="font-serif-luxe text-base tracking-wider text-amber-100 uppercase">
                      muko luxe_ concierge
                    </span>
                    <p className="text-xs text-amber-400/60 tracking-wider font-mono mt-0.5">
                      NAVIGATION PORTAL
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-9 h-9 rounded-lg border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-amber-500/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* The 6 Specific Navigation Tabs */}
                <nav className="mt-8 space-y-2">
                  {[
                    { number: '1', label: 'Intro', action: 'intro-section', desc: 'Welcome & Luxury Bar Services' },
                    { number: '2', label: 'About', action: 'about', desc: 'Dynamic Toggle · Premium Bartending & Reviews' },
                    { number: '3', label: 'Menu', action: 'menu-section', desc: 'Interactive Drinks & Signature Blend' },
                    { number: '4', label: 'Gallery', action: 'gallery-section', desc: 'Curated Artisanal Cocktails Only' },
                    { number: '5', label: 'Contact Info', action: 'booking-section', desc: 'Booking, Call, WhatsApp & Kabwe Map' },
                    { number: '6', label: 'Staff Login', action: 'staff', desc: 'Secure Employee Terminal' }
                  ].map((tab) => (
                    <button
                      key={tab.number}
                      onClick={() => handleNavClick(tab.action)}
                      className="w-full text-left p-3.5 rounded-xl border border-amber-500/10 hover:border-amber-500/40 bg-white/[0.02] hover:bg-amber-500/10 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-amber-400/50 group-hover:text-amber-300 transition-colors">
                          0{tab.number}
                        </span>
                        <div>
                          <div className="font-serif-luxe text-base text-amber-100 group-hover:text-amber-300 transition-colors">
                            {tab.label}
                          </div>
                          <div className="text-xs text-amber-200/50 group-hover:text-amber-200/80 transition-colors">
                            {tab.desc}
                          </div>
                        </div>
                      </div>
                      <span className="text-amber-500/40 group-hover:text-amber-300 group-hover:translate-x-1 transition-all text-sm">
                        →
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Customer Feedback Prompt Shortcut */}
                <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Post-Event Feedback</span>
                  </div>
                  <p className="text-xs text-amber-200/70 mb-3">
                    Have you experienced our mobile bartending concierge? Share your 1-5 star review.
                  </p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsFeedbackModalOpen(true);
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Rate Event Experience</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer Details */}
              <div className="pt-6 border-t border-amber-500/15 text-xs text-amber-300/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct: {settings.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Location: {settings.locationCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">{settings.openingHours}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
