import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wine, Check, Plus, Edit3, ArrowRight, X, Receipt } from 'lucide-react';
import { DrinkItem } from '../types';

export const InteractiveMenu: React.FC = () => {
  const {
    drinks,
    isStaffLoggedIn,
    setIsStaffModalOpen,
    selectedMenuDrinks,
    toggleMenuDrinkSelection,
    clearMenuDrinkSelection,
    totalMenuPrice
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Signature Cocktails', 'Craft Mocktails'];

  const filteredDrinks = drinks.filter(drink => {
    if (activeCategory === 'All') return true;
    return drink.category === activeCategory;
  });

  const scrollToBooking = () => {
    const bookingEl = document.getElementById('booking-section');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="menu-section" className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-xs text-amber-300 mb-3">
          <Wine className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-widest uppercase font-mono text-[10px]">
            Live Artisanal Beverage Portfolio
          </span>
        </div>

        <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          The Curated <span className="gold-gradient-text">Cocktail Menu</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-amber-200/70 font-editorial italic max-w-xl mx-auto">
          Every drink is artfully designed, measured, and served with premium mixers and crystal clear ice. Select cocktails below to view your real-time total price.
        </p>

        {/* Staff Quick Alert */}
        {isStaffLoggedIn && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Staff mode active: Prices and drink details update live</span>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="underline font-semibold hover:text-white ml-1 cursor-pointer"
            >
              Open Manager Terminal
            </button>
          </div>
        )}
      </div>

      {/* CUSTOMER TOTAL SUMMARY BANNER (Always visible when items are selected) */}
      <AnimatePresence>
        {selectedMenuDrinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-4 sm:p-5 rounded-2xl glass-panel border border-amber-400/50 shadow-2xl bg-gradient-to-r from-amber-950/40 via-black/80 to-amber-950/40 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  Customer Event Selection Summary
                </span>
                <div className="text-sm text-white font-medium">
                  <span className="font-bold text-amber-300">{selectedMenuDrinks.length} items selected</span>
                  <span className="text-amber-200/60 text-xs ml-2 hidden md:inline">
                    ({selectedMenuDrinks.map(d => d.name).join(', ')})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="text-[10px] font-mono text-amber-400/70 uppercase block">Total Price</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300">
                  ZMW {totalMenuPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearMenuDrinkSelection}
                  title="Clear selected drinks"
                  className="p-2 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-white/5 transition-colors cursor-pointer text-xs"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToBooking}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Book with Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Segmented Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                : 'glass-card text-amber-200/80 hover:text-white hover:border-amber-400/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Drink Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredDrinks.map((drink) => {
          const isSelected = selectedMenuDrinks.some(d => d.id === drink.id);
          const isMandatorySignature = drink.id === 'signature-blend' || drink.name.toLowerCase().includes('signature blend');

          return (
            <motion.div
              key={drink.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`glass-panel rounded-2xl overflow-hidden border flex flex-col justify-between group relative transition-all duration-300 ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-2xl shadow-amber-950/60 bg-amber-950/20'
                  : isMandatorySignature
                  ? 'border-amber-400/60 ring-1 ring-amber-400/30 shadow-2xl shadow-amber-950/40'
                  : 'border-amber-500/20 hover:border-amber-400/40'
              }`}
            >
              {/* Highlight ribbon for Signature Blend */}
              {isMandatorySignature && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[11px] font-bold tracking-wider uppercase shadow-lg">
                  <Sparkles className="w-3 h-3 text-black fill-black" />
                  Muko Luxe Signature
                </div>
              )}

              {/* Card Image */}
              <div className="relative h-60 w-full overflow-hidden bg-black/40">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-transparent to-transparent" />

                {/* Price Display */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg glass-panel text-amber-300 font-mono text-sm font-bold border border-amber-500/30">
                  ZMW {drink.price.toFixed(2)}
                </div>

                {drink.flavorProfile && (
                  <div className="absolute bottom-3 left-3 text-[11px] text-amber-200/90 font-serif-luxe tracking-wide drop-shadow-md">
                    {drink.flavorProfile}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-400/70 font-mono mb-1">
                    <span>{drink.category}</span>
                    <span>{drink.glassware || 'Craft Glassware'}</span>
                  </div>

                  <h3 className="font-serif-luxe text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {drink.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-amber-100/75 leading-relaxed">
                    {drink.description}
                  </p>

                  {/* Ingredients */}
                  <div className="mt-4 pt-3 border-t border-amber-500/10">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400/60 block mb-1.5">
                      Curated Botanicals & Mixers
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {drink.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] text-amber-200/70 font-light"
                        >
                          {ing}{idx < drink.ingredients.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-amber-500/15 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className={`inline-flex items-center gap-1 font-mono ${drink.isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${drink.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                      {drink.isAvailable ? 'Bar Ready' : 'Sold Out'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isStaffLoggedIn && (
                      <button
                        onClick={() => setIsStaffModalOpen(true)}
                        title="Edit drink details in Staff Terminal"
                        className="p-2 text-amber-300/80 hover:text-amber-100 hover:bg-amber-500/10 rounded-lg border border-amber-500/20 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => toggleMenuDrinkSelection(drink)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/30'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Selected · ZMW {drink.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Select for Event</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
