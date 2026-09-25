import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Quote, Award, Sparkles, CheckCircle2, MessageSquarePlus } from 'lucide-react';

export const AboutModal: React.FC = () => {
  const {
    isAboutOpen,
    setIsAboutOpen,
    reviews,
    setIsFeedbackModalOpen
  } = useApp();

  if (!isAboutOpen) return null;

  // Filter selected positive reviews (e.g. 4 or 5 stars, featured)
  const featuredReviews = reviews.filter(r => r.isFeatured && r.rating >= 4);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop: Clicking closes it immediately */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          onClick={() => setIsAboutOpen(false)}
        />

        {/* Dynamic Sliding / Expanding Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          className="relative z-10 w-full max-w-4xl glass-panel rounded-3xl border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Subtle gold glow accents */}
          <div className="absolute top-0 right-1/4 w-80 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-amber-500/20 shrink-0">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                About Muko Luxe Concierge
              </span>
              <h2 className="font-serif-luxe text-2xl sm:text-3xl text-white font-bold mt-1">
                The Beverage Experience
              </h2>
            </div>

            <button
              onClick={() => setIsAboutOpen(false)}
              title="Close About Us"
              className="w-10 h-10 rounded-xl border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-white hover:bg-amber-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto pr-2 mt-6 space-y-8">
            {/* MANDATORY EXACT COPY FRAME */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/60 to-amber-950/30 border border-amber-500/25 shadow-xl">
              <Quote className="w-8 h-8 text-amber-500/30 mb-3" />
              <p className="font-editorial text-lg sm:text-2xl text-amber-100/95 leading-relaxed italic">
                &ldquo;We provide premium beverage and mobile bartending services for weddings corporate events private celebrations birthdays cocktail receptions and other special occasions we help you plan your beverage experience source the drinks and mixers , manage the bar, prepare cocktails and mocktails, and provide professional service throughout your event so you don&apos;t have to worry about the beverage side of things&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-amber-500/15 flex items-center justify-between flex-wrap gap-2 text-xs text-amber-300/70">
                <span className="font-serif-luxe tracking-widest uppercase">
                  Muko Luxe Concierge Team
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  Full-Service Mobile Bartending
                </span>
              </div>
            </div>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-xl border border-amber-500/15">
                <div className="text-amber-400 font-serif-luxe text-sm font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Sourcing & Mixology
                </div>
                <p className="text-xs text-amber-200/70">
                  Top-shelf spirits, fresh botanicals, crystal ice, and artisanal bitters curated to your exact guest taste.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-amber-500/15">
                <div className="text-amber-400 font-serif-luxe text-sm font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Bar Setup & Management
                </div>
                <p className="text-xs text-amber-200/70">
                  Complete mobile bar counters, luxury glassware, chilling stations, and waste management from start to finish.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-amber-500/15">
                <div className="text-amber-400 font-serif-luxe text-sm font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Professional Service
                </div>
                <p className="text-xs text-amber-200/70">
                  Impeccably attired, trained mixologists delivering swift, gracious hospitality so hosts enjoy their own party.
                </p>
              </div>
            </div>

            {/* SELECTED POSITIVE CLIENT REVIEWS (FEEDBACK SYSTEM) */}
            <div className="pt-4 border-t border-amber-500/20">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="font-serif-luxe text-lg text-white font-semibold">
                      Selected Client Testimonials
                    </h3>
                  </div>
                  <p className="text-xs text-amber-300/70 mt-0.5">
                    Verified event ratings from completed weddings, corporate galas & celebrations.
                  </p>
                </div>

                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/40 transition-all cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leave Event Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="glass-card p-4 sm:p-5 rounded-xl border border-amber-500/20 flex flex-col justify-between"
                  >
                    <div>
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-amber-400/20'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-mono text-amber-400 ml-1.5">
                          {rev.rating}.0 / 5.0
                        </span>
                      </div>

                      <p className="text-xs text-amber-100/90 italic leading-relaxed">
                        &ldquo;{rev.reviewText}&rdquo;
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <div>
                        <div className="font-semibold text-amber-200">{rev.clientName}</div>
                        <div className="text-amber-400/60">{rev.eventType}</div>
                      </div>
                      <span className="text-amber-400/40 font-mono text-[10px]">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-6 pt-4 border-t border-amber-500/15 flex items-center justify-between shrink-0">
            <span className="text-xs text-amber-400/60 font-mono">
              MUKO LUXE CONCIERGE · KABWE, ZAMBIA
            </span>
            <button
              onClick={() => setIsAboutOpen(false)}
              className="px-5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/30 transition-colors"
            >
              Close About
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
