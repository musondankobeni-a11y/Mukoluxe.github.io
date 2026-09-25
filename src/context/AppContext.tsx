import React, { createContext, useContext, useState, useEffect } from 'react';
import { DrinkItem, OrderTicket, Review, AppSettings, PromotionBannerData } from '../types';
import {
  INITIAL_DRINKS,
  INITIAL_TICKETS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_PROMO
} from '../data/initialData';
import { hashPin, sanitizeInput } from '../utils/security';

interface VerifyPinResult {
  success: boolean;
  error?: string;
  remainingSeconds?: number;
}

interface AppContextType {
  drinks: DrinkItem[];
  tickets: OrderTicket[];
  reviews: Review[];
  settings: AppSettings;
  promo: PromotionBannerData;
  isStaffLoggedIn: boolean;
  activeNav: string;
  isAboutOpen: boolean;
  isStaffModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  feedbackTargetTicket: OrderTicket | null;
  selectedDrinkForInquiry: DrinkItem | null;
  selectedMenuDrinks: DrinkItem[];
  totalMenuPrice: number;
  // actions
  setIsStaffLoggedIn: (val: boolean) => void;
  setActiveNav: (val: string) => void;
  setIsAboutOpen: (val: boolean) => void;
  toggleAbout: () => void;
  setIsStaffModalOpen: (val: boolean) => void;
  setIsFeedbackModalOpen: (val: boolean) => void;
  setFeedbackTargetTicket: (ticket: OrderTicket | null) => void;
  setSelectedDrinkForInquiry: (drink: DrinkItem | null) => void;
  toggleMenuDrinkSelection: (drink: DrinkItem) => void;
  clearMenuDrinkSelection: () => void;
  // security actions
  verifyStaffPin: (pin: string) => Promise<VerifyPinResult>;
  changeStaffPin: (newPin: string) => Promise<void>;
  // drink actions
  updateDrink: (id: string, updated: Partial<DrinkItem>) => void;
  addDrink: (newDrink: Omit<DrinkItem, 'id'>) => void;
  deleteDrink: (id: string) => void;
  // ticket actions
  createTicket: (ticketData: Omit<OrderTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => OrderTicket;
  updateTicketStatus: (id: string, status: OrderTicket['status']) => void;
  deleteTicket: (id: string) => void;
  sendFeedbackPromptForTicket: (ticketId: string) => void;
  submitTicketFeedback: (ticketId: string | null, clientName: string, eventType: string, rating: number, reviewText: string) => void;
  // review actions
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'isFeatured' | 'verified'>) => void;
  toggleReviewFeatured: (id: string) => void;
  deleteReview: (id: string) => void;
  // settings & promo actions
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updatePromoBanner: (newPromo: Partial<PromotionBannerData>) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drinks, setDrinks] = useState<DrinkItem[]>(() => {
    try {
      const saved = localStorage.getItem('muko_drinks');
      return saved ? JSON.parse(saved) : INITIAL_DRINKS;
    } catch {
      return INITIAL_DRINKS;
    }
  });

  const [tickets, setTickets] = useState<OrderTicket[]>(() => {
    try {
      const saved = localStorage.getItem('muko_tickets');
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('muko_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('muko_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [promo, setPromo] = useState<PromotionBannerData>(() => {
    try {
      const saved = localStorage.getItem('muko_promo');
      return saved ? JSON.parse(saved) : INITIAL_PROMO;
    } catch {
      return INITIAL_PROMO;
    }
  });

  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('intro');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [feedbackTargetTicket, setFeedbackTargetTicket] = useState<OrderTicket | null>(null);
  const [selectedDrinkForInquiry, setSelectedDrinkForInquiry] = useState<DrinkItem | null>(null);
  const [selectedMenuDrinks, setSelectedMenuDrinks] = useState<DrinkItem[]>([]);

  // Automatically migrate legacy plain text PIN into cryptographic hash on boot
  useEffect(() => {
    const secureStorageInit = async () => {
      if (!settings.pinHash) {
        const rawPin = settings.staffPin || '20026';
        const hashed = await hashPin(rawPin);
        setSettings(prev => {
          const updated = { ...prev, pinHash: hashed };
          delete updated.staffPin;
          return updated;
        });
      }
    };
    secureStorageInit();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('muko_drinks', JSON.stringify(drinks));
  }, [drinks]);

  useEffect(() => {
    localStorage.setItem('muko_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('muko_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('muko_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('muko_promo', JSON.stringify(promo));
  }, [promo]);

  const toggleAbout = () => {
    setIsAboutOpen(prev => !prev);
  };

  // Selected Drinks and Live Total Calculation
  const totalMenuPrice = selectedMenuDrinks.reduce((sum, d) => sum + (d.price || 0), 0);

  const toggleMenuDrinkSelection = (drink: DrinkItem) => {
    setSelectedMenuDrinks(prev => {
      const exists = prev.some(d => d.id === drink.id);
      if (exists) {
        return prev.filter(d => d.id !== drink.id);
      } else {
        return [...prev, drink];
      }
    });
  };

  const clearMenuDrinkSelection = () => {
    setSelectedMenuDrinks([]);
  };

  // Cryptographic Staff Authentication with Rate-Limiting Protection
  const verifyStaffPin = async (inputPin: string): Promise<VerifyPinResult> => {
    // Check if currently locked out
    if (settings.lockoutUntil && Date.now() < settings.lockoutUntil) {
      const remainingSeconds = Math.ceil((settings.lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Terminal locked for security due to repeated failed attempts. Please retry in ${remainingSeconds}s.`,
        remainingSeconds
      };
    }

    const currentHash = settings.pinHash || (await hashPin('20026'));
    const inputHash = await hashPin(inputPin);

    if (inputHash === currentHash) {
      // Success: reset attempts & unlock
      setSettings(prev => ({
        ...prev,
        failedAttempts: 0,
        lockoutUntil: null
      }));
      setIsStaffLoggedIn(true);
      return { success: true };
    } else {
      // Failed: increment attempts
      const newAttempts = (settings.failedAttempts || 0) + 1;
      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 300000; // 5 minute security lockout
        setSettings(prev => ({
          ...prev,
          failedAttempts: newAttempts,
          lockoutUntil: lockoutTime
        }));
        return {
          success: false,
          error: 'Security alert: 5 consecutive failed attempts. Terminal locked for 5 minutes.',
          remainingSeconds: 300
        };
      } else {
        setSettings(prev => ({
          ...prev,
          failedAttempts: newAttempts
        }));
        const left = 5 - newAttempts;
        return {
          success: false,
          error: `Invalid security PIN. (${left} attempt${left > 1 ? 's' : ''} remaining before lockout)`
        };
      }
    }
  };

  const changeStaffPin = async (newPin: string) => {
    const hashed = await hashPin(newPin);
    setSettings(prev => {
      const copy = { ...prev, pinHash: hashed, failedAttempts: 0, lockoutUntil: null };
      delete copy.staffPin;
      return copy;
    });
  };

  const updateDrink = (id: string, updated: Partial<DrinkItem>) => {
    setDrinks(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const addDrink = (newDrink: Omit<DrinkItem, 'id'>) => {
    const id = 'drink-' + Date.now();
    setDrinks(prev => [{ ...newDrink, id }, ...prev]);
  };

  const deleteDrink = (id: string) => {
    setDrinks(prev => prev.filter(d => d.id !== id));
  };

  const createTicket = (ticketData: Omit<OrderTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => {
    const calculatedTotal = ticketData.selectedDrinks.reduce((sum, item) => sum + (item.price || 0), 0);

    const newTicket: OrderTicket = {
      ...ticketData,
      clientName: sanitizeInput(ticketData.clientName),
      clientPhone: sanitizeInput(ticketData.clientPhone),
      clientEmail: ticketData.clientEmail ? sanitizeInput(ticketData.clientEmail) : undefined,
      location: sanitizeInput(ticketData.location),
      specialNotes: ticketData.specialNotes ? sanitizeInput(ticketData.specialNotes) : undefined,
      totalPrice: ticketData.totalPrice || calculatedTotal,
      id: 't-' + Date.now(),
      ticketNumber: `MLC-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      feedbackStatus: 'Not Sent'
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const updateTicketStatus = (id: string, status: OrderTicket['status']) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated: OrderTicket = { ...t, status };
          if (status === 'Completed' && updated.feedbackStatus === 'Not Sent') {
            updated.feedbackStatus = 'Invite Sent';
          }
          return updated;
        }
        return t;
      })
    );
  };

  const sendFeedbackPromptForTicket = (ticketId: string) => {
    const target = tickets.find(t => t.id === ticketId);
    if (target) {
      setFeedbackTargetTicket(target);
      setIsFeedbackModalOpen(true);
      setTickets(prev =>
        prev.map(t => (t.id === ticketId ? { ...t, feedbackStatus: 'Invite Sent' } : t))
      );
    }
  };

  const submitTicketFeedback = (
    ticketId: string | null,
    clientName: string,
    eventType: string,
    rating: number,
    reviewText: string
  ) => {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      clientName: sanitizeInput(clientName),
      eventType: sanitizeInput(eventType),
      rating,
      reviewText: sanitizeInput(reviewText),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isFeatured: rating >= 4,
      verified: true
    };

    setReviews(prev => [newRev, ...prev]);

    if (ticketId) {
      setTickets(prev =>
        prev.map(t => {
          if (t.id === ticketId) {
            return {
              ...t,
              feedbackStatus: 'Submitted',
              feedback: {
                rating,
                reviewText: sanitizeInput(reviewText),
                submittedAt: new Date().toISOString()
              }
            };
          }
          return t;
        })
      );
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'isFeatured' | 'verified'>) => {
    const newRev: Review = {
      ...reviewData,
      clientName: sanitizeInput(reviewData.clientName),
      eventType: sanitizeInput(reviewData.eventType),
      reviewText: sanitizeInput(reviewData.reviewText),
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isFeatured: true,
      verified: true
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const toggleReviewFeatured = (id: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updatePromoBanner = (newPromo: Partial<PromotionBannerData>) => {
    setPromo(prev => ({ ...prev, ...newPromo }));
  };

  const resetToDefaults = () => {
    setDrinks(INITIAL_DRINKS);
    setTickets(INITIAL_TICKETS);
    setReviews(INITIAL_REVIEWS);
    setSettings(INITIAL_SETTINGS);
    setPromo(INITIAL_PROMO);
  };

  return (
    <AppContext.Provider
      value={{
        drinks,
        tickets,
        reviews,
        settings,
        promo,
        isStaffLoggedIn,
        activeNav,
        isAboutOpen,
        isStaffModalOpen,
        isFeedbackModalOpen,
        feedbackTargetTicket,
        selectedDrinkForInquiry,
        selectedMenuDrinks,
        totalMenuPrice,
        setIsStaffLoggedIn,
        setActiveNav,
        setIsAboutOpen,
        toggleAbout,
        setIsStaffModalOpen,
        setIsFeedbackModalOpen,
        setFeedbackTargetTicket,
        setSelectedDrinkForInquiry,
        toggleMenuDrinkSelection,
        clearMenuDrinkSelection,
        verifyStaffPin,
        changeStaffPin,
        updateDrink,
        addDrink,
        deleteDrink,
        createTicket,
        updateTicketStatus,
        deleteTicket,
        sendFeedbackPromptForTicket,
        submitTicketFeedback,
        addReview,
        toggleReviewFeatured,
        deleteReview,
        updateSettings,
        updatePromoBanner,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
