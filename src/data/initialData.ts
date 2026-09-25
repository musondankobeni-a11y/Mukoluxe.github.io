import { DrinkItem, OrderTicket, Review, AppSettings, PromotionBannerData } from '../types';

export const INITIAL_DRINKS: DrinkItem[] = [
  {
    id: 'signature-blend',
    name: 'Signature Blend',
    category: 'Signature Cocktails',
    description: 'Our bespoke crown creation. Infused with aged oak reserves, spiced citrus reduction, charred orange peel, and finished with delicate 24k edible gold leaf.',
    ingredients: ['Reserve Barrel Spirit', 'House Citrus Elixir', 'Aromatic Bitters', 'Dehydrated Blood Orange', '24k Gold Leaf'],
    price: 180,
    image: '/images/cocktail_signature_blend.jpg',
    isSignature: true,
    isAvailable: true,
    flavorProfile: 'Rich, Smoky Vanilla & Warm Citrus',
    glassware: 'Vintage Crystal Coupe'
  },
  {
    id: 'smoked-old-fashioned',
    name: 'Smoked Amber Old Fashioned',
    category: 'Signature Cocktails',
    description: 'Slow-smoked under applewood bells before your guests. Poured over hand-carved clear crystal ice blocks with flamed orange oils.',
    ingredients: ['Bourbon Reserve', 'Demerara Syrup', 'Angostura & Orange Bitters', 'Applewood Cold Smoke'],
    price: 165,
    image: '/images/cocktail_smoked_old_fashioned.jpg',
    isSignature: false,
    isAvailable: true,
    flavorProfile: 'Robust Oak, Dark Caramel, Peat Smoke',
    glassware: 'Cut Crystal Tumbler'
  },
  {
    id: 'berry-bramble',
    name: 'Wild Blackberry Bramble',
    category: 'Signature Cocktails',
    description: 'Hand-muddled wild blackberries folded into premium botanical spirit, fresh lemon juice, crushed diamond ice, and fresh garden rosemary.',
    ingredients: ['Dry Botanical Spirit', 'Blackberry Liqueur', 'Fresh Meyer Lemon', 'Crushed Ice', 'Rosemary Sprig'],
    price: 150,
    image: '/images/cocktail_berry_bramble.jpg',
    isSignature: false,
    isAvailable: true,
    flavorProfile: 'Bright, Tart Berry with Pine Botanicals',
    glassware: 'Diamond Highball'
  },
  {
    id: 'velvet-martini',
    name: 'Velvet Reserve Martini',
    category: 'Signature Cocktails',
    description: 'Silky microfoam foam cresting dark roasted espresso reduction and smooth vanilla cream liqueur. The ultimate celebratory evening toast.',
    ingredients: ['Double Espresso Reduction', 'Velvet Cream Spirit', 'Coffee Liqueur', 'Vanilla Pod Infusion'],
    price: 160,
    image: '/images/cocktail_velvet_martini.jpg',
    isSignature: false,
    isAvailable: true,
    flavorProfile: 'Velvety Roasted Espresso & Dark Cocoa',
    glassware: 'Chilled Stemmed Martini Glass'
  },
  {
    id: 'emerald-botanical-fizz',
    name: 'Emerald Botanical Fizz',
    category: 'Craft Mocktails',
    description: 'Refreshing zero-proof elixir of pressed cucumber, elderflower tonic, lime ribbons, and effervescent soda water.',
    ingredients: ['English Cucumber Ribbon', 'Zero-Proof Botanical Distillate', 'Elderflower Cordial', 'Sparkling Mineral Water'],
    price: 95,
    image: '/images/cocktail_emerald_botanical.jpg',
    isSignature: false,
    isAvailable: true,
    flavorProfile: 'Crisp, Herbal, Effervescent & Clean',
    glassware: 'Fluted Collins'
  },
  {
    id: 'citrus-sunburst-mocktail',
    name: 'Zambezi Sunburst Mocktail',
    category: 'Craft Mocktails',
    description: 'Sun-ripened passion fruit pulp, crushed ginger beer, fresh mint bouquet, and cold-pressed ruby grapefruit.',
    ingredients: ['Wild Passion Fruit', 'Spiced Ginger Extract', 'Cold-Pressed Grapefruit', 'Garden Mint Sprig'],
    price: 90,
    image: '/images/cocktail_zambezi_sunburst.jpg',
    isSignature: false,
    isAvailable: true,
    flavorProfile: 'Zesty Tropical Citrus with Fiery Ginger Kick',
    glassware: 'Crystal Stem Coupe'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    clientName: 'Dr. Thandiwe & Mwamba Banda',
    eventType: 'Wedding Reception (180 Guests)',
    rating: 5,
    reviewText: 'Muko Luxe Concierge made our wedding reception unforgettable! The Signature Blend was the highlight of the night—our guests are still raving about the bar presentation and impeccable bartending service.',
    date: 'March 14, 2026',
    isFeatured: true,
    verified: true
  },
  {
    id: 'rev-2',
    clientName: 'Chanda Mulenga (Apex Mining Gala)',
    eventType: 'Corporate Annual Gala',
    rating: 5,
    reviewText: 'Flawless execution from start to finish. Humphrey and the Muko Luxe team managed a crowd of 250 executives with speed, class, and absolute professionalism. The mobile bar setup transformed our venue.',
    date: 'February 28, 2026',
    isFeatured: true,
    verified: true
  },
  {
    id: 'rev-3',
    clientName: 'Bwalya Phiri',
    eventType: '40th Birthday Soirée',
    rating: 5,
    reviewText: 'Zero stress for the host! They brought premium glassware, handled all mixers, and served the most delicious craft cocktails. Truly luxury mobile bartending at its finest.',
    date: 'January 19, 2026',
    isFeatured: true,
    verified: true
  }
];

export const INITIAL_TICKETS: OrderTicket[] = [
  {
    id: 't-1001',
    ticketNumber: 'MLC-2026-081',
    createdAt: '2026-03-24T14:30:00Z',
    clientName: 'Natasha Lungu',
    clientPhone: '0977234510',
    clientEmail: 'natasha.lungu@events.zm',
    eventType: 'Wedding Reception',
    eventDate: '2026-04-18',
    location: 'Kabwe Golf Club Gardens',
    guestCount: 150,
    packageType: 'Full Mobile Bar Concierge',
    selectedDrinks: [
      { drinkId: 'signature-blend', name: 'Signature Blend', price: 180 },
      { drinkId: 'smoked-old-fashioned', name: 'Smoked Amber Old Fashioned', price: 165 },
      { drinkId: 'emerald-botanical-fizz', name: 'Emerald Botanical Fizz', price: 95 }
    ],
    totalPrice: 440,
    specialNotes: 'Requires custom welcome cocktail signage and 2 dedicated mixologists.',
    status: 'Bar Planning',
    feedbackStatus: 'Not Sent'
  },
  {
    id: 't-1002',
    ticketNumber: 'MLC-2026-079',
    createdAt: '2026-03-20T09:15:00Z',
    clientName: 'David Tembo',
    clientPhone: '0966458921',
    clientEmail: 'david.tembo@premier.co.zm',
    eventType: 'Corporate Cocktail Reception',
    eventDate: '2026-03-22',
    location: 'Kabwe Civic Center Hall',
    guestCount: 90,
    packageType: 'Premium Cocktail Bar',
    selectedDrinks: [
      { drinkId: 'signature-blend', name: 'Signature Blend', price: 180 },
      { drinkId: 'berry-bramble', name: 'Wild Blackberry Bramble', price: 150 }
    ],
    totalPrice: 330,
    specialNotes: 'VIP corporate guests. Need fast service.',
    status: 'Completed',
    feedbackStatus: 'Submitted',
    feedback: {
      rating: 5,
      reviewText: 'Incredible setup and lightning-fast craft service. Will book every year!',
      submittedAt: '2026-03-23T11:00:00Z'
    }
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  staffPin: '20026',
  failedAttempts: 0,
  lockoutUntil: null,
  openingHours: 'Monday – Sunday: 10:00 AM – 02:00 AM (24/7 Concierge for Scheduled Events)',
  contactPhone: '0976516321',
  whatsappPhone: '+2609 68 3 66 6 47',
  locationCode: 'GCWW+HQ6 Kabwe',
  locationLabel: 'Kabwe, Central Province, Zambia'
};

export const INITIAL_PROMO: PromotionBannerData = {
  isActive: true,
  tag: 'EVENT PROMOTION',
  message: 'Book Your 2026 Wedding or Corporate Reception & Receive Complimentary Signature Welcome Cocktails for up to 50 guests!',
  ctaText: 'Reserve Concierge'
};
