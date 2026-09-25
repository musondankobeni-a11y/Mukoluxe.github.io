import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Sparkles, Calendar, GlassWater, ArrowDown, Award, Star, Compass } from 'lucide-react';

export const IntroHero: React.FC = () => {
  const { toggleAbout, setIsFeedbackModalOpen } = useApp();

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="intro-section"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-8 py-16"
    >
      {/* Dynamic Background with Cocktails and Ambient Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.08, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src="/src/assets/images/cocktail_hero_luxury_1790315307049.jpg"
            alt="Muko Luxe Luxury Cocktail Lounge & Mobile Bar Atmosphere"
            className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Ambient Radial Cocktail Glows & Glassmorphic Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/85" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Screen Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Brand Tag */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-amber-500/30 text-xs text-amber-200/90 mb-6 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-widest uppercase font-medium text-[11px]">
            Bespoke Mobile Bartending & Event Beverage Concierge
          </span>
        </motion.div>

        {/* Main Screen Title: Exactly "Welcome to muko luxe concierge" */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif-luxe text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          Welcome to <span className="gold-gradient-text">muko luxe concierge</span>
        </motion.h1>

        {/* Dynamic Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-6 text-base sm:text-xl text-amber-100/80 font-editorial max-w-2xl leading-relaxed italic"
        >
          Curated artisanal cocktails, master mixology, and seamless bar management crafted exclusively for prestigious weddings, galas, and private celebrations.
        </motion.p>

        {/* Quick Action Glass Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full max-w-md sm:max-w-none"
        >
          <button
            onClick={scrollToBooking}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-sm tracking-wide shadow-xl shadow-amber-950/50 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Concierge Service</span>
          </button>

          <button
            onClick={scrollToMenu}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel border border-amber-500/40 text-amber-100 hover:text-white hover:border-amber-400 font-medium text-sm tracking-wide hover:bg-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <GlassWater className="w-4 h-4 text-amber-400" />
            <span>Explore Cocktail Menu</span>
          </button>

          <button
            onClick={toggleAbout}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl glass-card border border-white/10 text-amber-200/80 hover:text-amber-100 font-medium text-sm tracking-wide hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>About Us & Reviews</span>
          </button>
        </motion.div>

        {/* Featured Signature Blend Teaser Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-14 w-full max-w-2xl"
        >
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/25 flex flex-col sm:flex-row items-center gap-4 text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
              <img
                src="/src/assets/images/cocktail_signature_blend_1790315318909.jpg"
                alt="Signature Blend Cocktail"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Featured Masterpiece
                </span>
                <span className="text-xs text-amber-400 font-mono">ZMW 180</span>
              </div>
              <h3 className="font-serif-luxe text-base sm:text-lg text-amber-100 font-semibold mt-1">
                The Signature Blend
              </h3>
              <p className="text-xs text-amber-200/70 mt-1 line-clamp-2">
                Aged barrel spirit infused with warm citrus elixir, smoked aromatics & 24k gold leaf. The signature touch for your celebration.
              </p>
            </div>

            <button
              onClick={scrollToMenu}
              className="px-4 py-2 text-xs font-semibold text-amber-300 hover:text-white rounded-lg border border-amber-500/30 hover:bg-amber-500/20 transition-all shrink-0"
            >
              View in Menu
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="mt-12 text-amber-400/50 hover:text-amber-300 cursor-pointer flex flex-col items-center gap-1 text-xs"
          onClick={scrollToMenu}
        >
          <span>Scroll to Discover</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </div>
    </section>
  );
};
