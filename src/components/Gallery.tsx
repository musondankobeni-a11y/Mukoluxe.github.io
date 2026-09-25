import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassWater, Sparkles, X, Eye, ZoomIn } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface CocktailGalleryItem {
  id: string;
  title: string;
  type: 'cocktail'; // programmatically strictly cocktails
  image: string;
  notes: string;
  glassware: string;
  technique: string;
}

const RAW_GALLERY_ITEMS: CocktailGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Signature Blend Masterpiece',
    type: 'cocktail',
    image: '/images/cocktail_signature_blend.jpg',
    notes: 'Aged spirit, spiced citrus cordial, flamed blood orange & 24k edible gold.',
    glassware: 'Vintage Gold-Rimmed Coupe',
    technique: 'Stirred over hand-carved block ice'
  },
  {
    id: 'gal-2',
    title: 'Smoked Applewood Old Fashioned',
    type: 'cocktail',
    image: '/images/cocktail_smoked_old_fashioned.jpg',
    notes: 'Bourbon reserve infused under cold applewood smoke bell, flamed peel.',
    glassware: 'Crystal Diamond Tumbler',
    technique: 'Aromatic Bell Smoke Infusion'
  },
  {
    id: 'gal-3',
    title: 'Wild Botanical Bramble Highball',
    type: 'cocktail',
    image: '/images/cocktail_berry_bramble.jpg',
    notes: 'Muddled fresh blackberries, crushed crystal ice, garden rosemary sprig.',
    glassware: 'Cut Glass Diamond Highball',
    technique: 'Layered Swizzle over Crushed Ice'
  },
  {
    id: 'gal-4',
    title: 'Velvet Midnight Reserve Martini',
    type: 'cocktail',
    image: '/images/cocktail_velvet_martini.jpg',
    notes: 'Double-shaken microfoam cream, roasted espresso bean reduction.',
    glassware: 'Chilled Stemmed Martini Glass',
    technique: 'Hard Shaken with Nitrogen Chill'
  },
  {
    id: 'gal-5',
    title: 'Emerald Botanical Cucumber Fizz',
    type: 'cocktail',
    image: '/images/cocktail_emerald_botanical.jpg',
    notes: 'Crisp English cucumber ribbons, elderflower cordial, zero-proof distillate.',
    glassware: 'Fluted Crystal Highball',
    technique: 'Carbonated Fizz with Herb Infusion'
  },
  {
    id: 'gal-6',
    title: 'Zambezi Sunburst Tropical Elixir',
    type: 'cocktail',
    image: '/images/cocktail_zambezi_sunburst.jpg',
    notes: 'Wild passion fruit, cold-pressed ruby grapefruit, and spiced ginger extract.',
    glassware: 'Crystal Stem Coupe',
    technique: 'Hand Shaken & Double Strained'
  },
  {
    id: 'gal-7',
    title: 'Atmospheric Mobile Bar Showcase',
    type: 'cocktail',
    image: '/images/mobile_bar_luxury_event.jpg',
    notes: 'Luxury mobile bar service featuring artisanal spirits and crystal barware.',
    glassware: 'Bespoke Event Glassware Suite',
    technique: 'Full Mobile Bar Concierge Station'
  }
];

export const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<CocktailGalleryItem | null>(null);

  // PROGRAMMATIC REQUIREMENT:
  // "Clean the entire layout to display only high-quality cocktail pictures.
  // Programmatically strip out any other non-cocktail images from appearing."
  const verifiedCocktailGallery = RAW_GALLERY_ITEMS.filter((item) => {
    // strictly cocktail verification
    const isStrictlyCocktail = item.type === 'cocktail';
    const noCoffeeForbiddenWords = !item.title.toLowerCase().includes('latte') &&
      !item.title.toLowerCase().includes('cappuccino') &&
      !item.notes.toLowerCase().includes('coffee shop') &&
      !item.image.includes('coffee');
    return isStrictlyCocktail && noCoffeeForbiddenWords;
  });

  return (
    <section id="gallery-section" className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-xs text-amber-300 mb-3">
          <GlassWater className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-widest uppercase font-mono text-[10px]">
            Visual Mixology Showcase
          </span>
        </div>

        <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Artisanal <span className="gold-gradient-text">Cocktail Gallery</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-amber-200/70 font-editorial italic max-w-xl mx-auto">
          High-definition captures of our bespoke cocktail creations, hand-carved ice, and mobile bar presentations.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedCocktailGallery.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-2xl overflow-hidden glass-panel border border-amber-500/20 hover:border-amber-400/50 cursor-pointer aspect-4/3 sm:aspect-square"
          >
            <img
              src={resolveImageUrl(item.image)}
              alt={item.title}
              loading="lazy"
              decoding="async"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full glass-panel border border-amber-500/40 flex items-center justify-center text-amber-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
              <ZoomIn className="w-4 h-4" />
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 transform transition-transform duration-300">
              <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase mb-1">
                {item.glassware}
              </div>
              <h3 className="font-serif-luxe text-lg text-white font-bold group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-amber-200/70 mt-1 line-clamp-2">
                {item.notes}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setSelectedPhoto(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 max-w-4xl w-full glass-panel rounded-3xl border border-amber-500/40 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-amber-500/40 text-amber-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-3/5 bg-black/80 flex items-center justify-center">
                <img
                  src={resolveImageUrl(selectedPhoto.image)}
                  alt={selectedPhoto.title}
                  onError={handleImageError}
                  className="w-full h-full max-h-[60vh] md:max-h-[80vh] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
                    <Sparkles className="w-3 h-3" />
                    Verified Cocktail Craft
                  </div>

                  <h3 className="font-serif-luxe text-2xl text-white font-bold mb-3">
                    {selectedPhoto.title}
                  </h3>

                  <p className="text-sm text-amber-100/80 leading-relaxed font-editorial italic mb-6">
                    &ldquo;{selectedPhoto.notes}&rdquo;
                  </p>

                  <div className="space-y-3 border-t border-amber-500/15 pt-4 text-xs">
                    <div>
                      <span className="text-amber-400/60 block font-mono text-[10px] uppercase">
                        Service Glassware
                      </span>
                      <span className="text-amber-200 font-medium">{selectedPhoto.glassware}</span>
                    </div>

                    <div>
                      <span className="text-amber-400/60 block font-mono text-[10px] uppercase">
                        Mixologist Technique
                      </span>
                      <span className="text-amber-200 font-medium">{selectedPhoto.technique}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-amber-500/15 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400/50 font-mono">
                    MUKO LUXE GALLERY
                  </span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/30"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
