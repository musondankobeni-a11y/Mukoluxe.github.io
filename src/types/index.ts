export interface DrinkItem {
  id: string;
  name: string;
  category: 'Signature Cocktails' | 'Craft Mocktails' | 'Reserve Spirits' | 'Bar Packages';
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  isSignature?: boolean;
  isAvailable: boolean;
  flavorProfile?: string;
  glassware?: string;
}

export interface OrderTicket {
  id: string;
  ticketNumber: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: number;
  packageType: string;
  selectedDrinks: { drinkId: string; name: string; price?: number; quantity?: number }[];
  totalPrice: number;
  specialNotes?: string;
  status: 'Pending' | 'Bar Planning' | 'Confirmed' | 'Completed' | 'Cancelled';
  feedbackStatus?: 'Not Sent' | 'Invite Sent' | 'Submitted';
  feedback?: {
    rating: number;
    reviewText: string;
    submittedAt: string;
  };
}

export interface Review {
  id: string;
  clientName: string;
  eventType: string;
  rating: number;
  reviewText: string;
  date: string;
  isFeatured: boolean;
  verified: boolean;
}

export interface PromotionBannerData {
  isActive: boolean;
  tag: string;
  message: string;
  ctaText?: string;
}

export interface AppSettings {
  staffPin?: string;
  pinHash?: string;
  failedAttempts?: number;
  lockoutUntil?: number | null;
  openingHours: string;
  contactPhone: string;
  whatsappPhone: string;
  locationCode: string;
  locationLabel: string;
}

export interface AppNotification {
  id: string;
  type: 'booking' | 'purchase' | 'status' | 'general';
  title: string;
  message: string;
  timestamp: number;
  ticketNumber?: string;
  amount?: number;
  clientName?: string;
}

