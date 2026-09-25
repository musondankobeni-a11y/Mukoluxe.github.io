import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  X,
  Wine,
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  Trash2,
  Plus,
  Edit2,
  LogOut,
  Upload,
  Image as ImageIcon,
  KeyRound,
  Shield,
  Search,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { DrinkItem } from '../types';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

const PRESET_COCKTAIL_PHOTOS = [
  { name: 'Signature Blend', url: '/images/cocktail_signature_blend.jpg' },
  { name: 'Smoked Amber Old Fashioned', url: '/images/cocktail_smoked_old_fashioned.jpg' },
  { name: 'Wild Blackberry Bramble', url: '/images/cocktail_berry_bramble.jpg' },
  { name: 'Velvet Reserve Martini', url: '/images/cocktail_velvet_martini.jpg' },
  { name: 'Emerald Botanical Fizz', url: '/images/cocktail_emerald_botanical.jpg' },
  { name: 'Zambezi Sunburst Mocktail', url: '/images/cocktail_zambezi_sunburst.jpg' },
  { name: 'Atmospheric Mobile Bar', url: '/images/mobile_bar_luxury_event.jpg' },
  { name: 'Luxury Lounge Hero', url: '/images/cocktail_hero_luxury.jpg' }
];

export const StaffTerminalModal: React.FC = () => {
  const {
    isStaffModalOpen,
    setIsStaffModalOpen,
    isStaffLoggedIn,
    setIsStaffLoggedIn,
    settings,
    updateSettings,
    changeStaffPin,
    drinks,
    updateDrink,
    addDrink,
    deleteDrink,
    promo,
    updatePromoBanner,
    reviews,
    toggleReviewFeatured,
    deleteReview,
    verifyStaffPin,
    dismissNotification
  } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // Tab state: VIP Booking is removed completely, products start immediately at the top
  const [activeTab, setActiveTab] = useState<'products' | 'promo' | 'hours' | 'reviews' | 'security'>('products');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search filter for drinks
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Toast Notification Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Change PIN state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  // Edit drink form
  const [editingDrinkId, setEditingDrinkId] = useState<string | null>(null);
  const [editDrinkForm, setEditDrinkForm] = useState<Partial<DrinkItem>>({});
  const [editIngredientsInput, setEditIngredientsInput] = useState('');
  const [isPhotoPickerOpenFor, setIsPhotoPickerOpenFor] = useState<'editing' | 'new' | null>(null);

  // Add new drink form
  const [isAddingNewDrink, setIsAddingNewDrink] = useState(false);
  const [newDrinkForm, setNewDrinkForm] = useState<Omit<DrinkItem, 'id'>>({
    name: '',
    category: 'Signature Cocktails',
    description: '',
    ingredients: [],
    price: 150,
    image: '/images/cocktail_signature_blend.jpg',
    isAvailable: true,
    isSignature: false,
    flavorProfile: '',
    glassware: 'Vintage Crystal Coupe'
  });
  const [newIngredientsInput, setNewIngredientsInput] = useState('');

  // File upload refs
  const editImageFileRef = useRef<HTMLInputElement | null>(null);
  const newImageFileRef = useRef<HTMLInputElement | null>(null);

  // Edit hours form
  const [hoursInput, setHoursInput] = useState(settings.openingHours);

  // Edit promo form
  const [promoMessageInput, setPromoMessageInput] = useState(promo.message);
  const [promoTagInput, setPromoTagInput] = useState(promo.tag);
  const [promoCtaInput, setPromoCtaInput] = useState(promo.ctaText || 'Reserve Concierge');
  const [promoActiveInput, setPromoActiveInput] = useState(promo.isActive);

  // Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'drink' | 'review';
    id: string;
    title: string;
  } | null>(null);

  // Keep inputs synced
  useEffect(() => {
    setHoursInput(settings.openingHours);
  }, [settings.openingHours]);

  useEffect(() => {
    setPromoMessageInput(promo.message);
    setPromoTagInput(promo.tag);
    setPromoCtaInput(promo.ctaText || 'Reserve Concierge');
    setPromoActiveInput(promo.isActive);
  }, [promo]);

  // Core PIN verification logic
  const executePinVerification = useCallback(async (pinToVerify: string) => {
    if (!pinToVerify.trim() || isVerifying) return;
    setIsVerifying(true);
    setPinError(false);
    setErrorMessage('');

    const result = await verifyStaffPin(pinToVerify.trim());
    setIsVerifying(false);

    if (result.success) {
      setPinError(false);
      setErrorMessage('');
      setEnteredPin('');
      showToast('Welcome to the staff menu!!');
    } else {
      setPinError(true);
      setErrorMessage('Wrong PIN');
      setShakeKey(prev => prev + 1);
      // Automatically clear after a short moment so user can immediately re-enter without pressing clear
      setTimeout(() => {
        setEnteredPin('');
      }, 700);
    }
  }, [isVerifying, verifyStaffPin]);

  // Handle number input (both tap and keyboard)
  const handleKeypadPress = useCallback((digit: string) => {
    if (enteredPin.length >= 10 || isVerifying) return;
    const next = enteredPin + digit;
    setEnteredPin(next);
    setPinError(false);
    setErrorMessage('');

    // Automatically log in after 5 digits entered
    if (next.length === 5) {
      executePinVerification(next);
    }
  }, [enteredPin, isVerifying, executePinVerification]);

  const handleKeypadBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setPinError(false);
    setErrorMessage('');
  };

  const handleKeypadClear = () => {
    setEnteredPin('');
    setPinError(false);
    setErrorMessage('');
  };

  // Keyboard listener for desktop/laptop/hardware keypad
  useEffect(() => {
    if (!isStaffModalOpen || isStaffLoggedIn) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        handleKeypadBackspace();
      } else if (e.key === 'Escape') {
        setIsStaffModalOpen(false);
      } else if (e.key === 'Enter') {
        if (enteredPin.length > 0) {
          executePinVerification(enteredPin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStaffModalOpen, isStaffLoggedIn, enteredPin, handleKeypadPress, executePinVerification, setIsStaffModalOpen]);

  if (!isStaffModalOpen) return null;

  const handleLogout = () => {
    setIsStaffLoggedIn(false);
    dismissNotification();
    setEnteredPin('');
    setPinError(false);
    setErrorMessage('');
    showToast('Terminal Locked Securely.');
  };

  const handleSaveHours = () => {
    updateSettings({ openingHours: hoursInput });
    showToast('✓ Operating Hours published live to website.');
  };

  const handleSavePromo = () => {
    updatePromoBanner({
      isActive: promoActiveInput,
      message: promoMessageInput,
      tag: promoTagInput,
      ctaText: promoCtaInput
    });
    showToast('✓ Promotional Banner updated live on website.');
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinChangeError('PIN must be at least 4 digits/characters.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeError('New PIN and confirmation PIN do not match.');
      return;
    }
    await changeStaffPin(newPin);
    setPinChangeSuccess(true);
    setPinChangeError('');
    setNewPin('');
    setConfirmPin('');
    showToast('✓ Security Access PIN updated successfully.');
    setTimeout(() => setPinChangeSuccess(false), 4000);
  };

  const startEditDrink = (drink: DrinkItem) => {
    setEditingDrinkId(drink.id);
    setEditDrinkForm(drink);
    setEditIngredientsInput(drink.ingredients.join(', '));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isEditing) {
        setEditDrinkForm(prev => ({ ...prev, image: result }));
      } else {
        setNewDrinkForm(prev => ({ ...prev, image: result }));
      }
      showToast('✓ Photo loaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const saveDrinkEdit = (id: string) => {
    const updatedIngredients = editIngredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    updateDrink(id, {
      ...editDrinkForm,
      image: resolveImageUrl(editDrinkForm.image),
      ingredients: updatedIngredients.length > 0 ? updatedIngredients : editDrinkForm.ingredients
    });
    setEditingDrinkId(null);
    showToast(`✓ "${editDrinkForm.name || 'Drink'}" updated on live menu.`);
  };

  const handleAddNewDrink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrinkForm.name) return;

    const parsedIng = newIngredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    addDrink({
      ...newDrinkForm,
      image: resolveImageUrl(newDrinkForm.image),
      ingredients: parsedIng.length > 0 ? parsedIng : ['Reserve Spirit', 'Botanical Cordial', 'Hand-Cut Ice']
    });

    setIsAddingNewDrink(false);
    showToast(`✓ "${newDrinkForm.name}" published to live cocktail menu.`);
    setNewDrinkForm({
      name: '',
      category: 'Signature Cocktails',
      description: '',
      ingredients: [],
      price: 150,
      image: '/images/cocktail_signature_blend.jpg',
      isAvailable: true,
      isSignature: false,
      flavorProfile: '',
      glassware: 'Vintage Crystal Coupe'
    });
    setNewIngredientsInput('');
  };

  const executeDelete = () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;
    if (type === 'drink') {
      deleteDrink(id);
      showToast(`✓ "${title}" removed from cocktail list.`);
    } else if (type === 'review') {
      deleteReview(id);
      showToast(`✓ Review from "${title}" deleted.`);
    }
    setDeleteConfirmation(null);
  };

  // Filter drinks for search
  const filteredDrinks = drinks.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.flavorProfile?.toLowerCase().includes(q) ||
      d.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/94 backdrop-blur-2xl"
          onClick={() => setIsStaffModalOpen(false)}
        />

        {/* Floating Toast Notification Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-4 z-[70] left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-2xl flex items-center gap-2 border border-amber-300"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmation && (
            <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={() => setDeleteConfirmation(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative z-10 max-w-sm w-full glass-panel rounded-2xl border border-red-500/40 p-6 text-center shadow-2xl bg-[#140c0a]"
              >
                <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="font-serif-luxe text-lg text-white font-bold">
                  Confirm Removal
                </h4>
                <p className="text-xs text-amber-200/70 mt-1 mb-5">
                  Are you sure you want to delete <strong className="text-white font-semibold">"{deleteConfirmation.title}"</strong>?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDeleteConfirmation(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDelete}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Preset Photo Picker Sub-Modal */}
        <AnimatePresence>
          {isPhotoPickerOpenFor && (
            <div className="fixed inset-0 z-[72] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={() => setIsPhotoPickerOpenFor(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 max-w-2xl w-full glass-panel rounded-3xl border border-amber-500/40 p-6 shadow-2xl bg-[#0f0c0a] max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif-luxe text-lg text-white font-bold">
                      Luxury Cocktail Gallery Studio
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsPhotoPickerOpenFor(null)}
                    className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-amber-200/70 mb-4">
                  Select a high-resolution bespoke cocktail capture to display instantly on the live website:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_COCKTAIL_PHOTOS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        if (isPhotoPickerOpenFor === 'editing') {
                          setEditDrinkForm(prev => ({ ...prev, image: preset.url }));
                        } else {
                          setNewDrinkForm(prev => ({ ...prev, image: preset.url }));
                        }
                        setIsPhotoPickerOpenFor(null);
                        showToast(`✓ Selected: ${preset.name}`);
                      }}
                      className="group relative rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-400 text-left p-1 bg-black/50 transition-all hover:scale-102 cursor-pointer"
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-black/60 mb-2 relative">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] text-amber-200 font-medium truncate drop-shadow">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-amber-500/15 flex items-center justify-between text-xs text-amber-400/70">
                  <span>Tip: You can also upload any custom camera photo from your phone.</span>
                  <button
                    onClick={() => setIsPhotoPickerOpenFor(null)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Terminal Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl border border-amber-500/40 p-4 sm:p-6 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col bg-[#090807]/95"
        >
          {/* Streamlined Executive Header: Placed directly at the very top */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-amber-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/25 to-amber-900/40 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg shrink-0">
                {isStaffLoggedIn ? <Shield className="w-5 h-5 text-amber-300" /> : <Lock className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                    MUKO LUXE · EXECUTIVE CONCIERGE
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="font-serif-luxe text-base sm:text-xl text-white font-bold tracking-tight">
                  {isStaffLoggedIn ? 'Product & Menu Management Console' : 'Staff Security Authentication'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isStaffLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/15 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock Terminal</span>
                </button>
              )}
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="w-9 h-9 rounded-xl border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-white hover:bg-amber-500/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!isStaffLoggedIn ? (
            /* ULTRA-FANCY VIP PIN ENTRY (AUTO-LOGINS ON CORRECT PIN, SAYS 'WRONG PIN' ON ERROR) */
            <div className="py-6 sm:py-8 max-w-sm mx-auto w-full text-center flex-1 flex flex-col justify-center">
              {/* Crest Insignia */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-900/30 to-black border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-xl">
                <Lock className="w-6 h-6 text-amber-300" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>

              <h3 className="font-serif-luxe text-xl sm:text-2xl text-white font-bold">
                Private Vault Access
              </h3>
              <p className="text-xs text-amber-200/70 mt-1 mb-4">
                Enter your 5-digit employee security PIN
              </p>

              {/* Masked PIN Indicator with Shake on Error */}
              <motion.div
                key={shakeKey}
                animate={pinError ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`flex items-center justify-center gap-3 mb-4 py-3 px-4 rounded-2xl glass-card border transition-colors ${
                  pinError ? 'border-red-500 bg-red-950/40' : 'border-amber-500/25 bg-black/60'
                }`}
              >
                {Array.from({ length: 5 }).map((_, idx) => {
                  const isFilled = idx < enteredPin.length;
                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isFilled ? 1.2 : 1 }}
                      className={`w-3.5 h-3.5 rounded-full transition-colors ${
                        pinError
                          ? 'bg-red-400'
                          : isFilled
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/50'
                          : 'border border-amber-500/30 bg-black/40'
                      }`}
                    />
                  );
                })}
              </motion.div>

              {/* Wrong PIN Error Indicator */}
              <div className="h-6 mb-2">
                {pinError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 font-mono font-bold tracking-wider uppercase"
                  >
                    {errorMessage || 'Wrong PIN'}
                  </motion.p>
                )}
                {isVerifying && !pinError && (
                  <p className="text-xs text-amber-400 font-mono animate-pulse">
                    Verifying PIN...
                  </p>
                )}
              </div>

              {/* Phone-Friendly Touch Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    disabled={isVerifying}
                    className="h-12 rounded-2xl glass-card border border-amber-500/20 text-white font-mono text-xl font-bold hover:bg-amber-500/20 hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  disabled={isVerifying}
                  className="h-12 rounded-2xl glass-card border border-amber-500/20 text-amber-400/80 font-mono text-xs uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  disabled={isVerifying}
                  className="h-12 rounded-2xl glass-card border border-amber-500/20 text-white font-mono text-xl font-bold hover:bg-amber-500/20 hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleKeypadBackspace}
                  disabled={isVerifying}
                  className="h-12 rounded-2xl glass-card border border-amber-500/20 text-amber-400/80 font-mono text-sm hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Backspace"
                >
                  ⌫
                </button>
              </div>

              {/* Manual Unlock button as backup */}
              <button
                type="button"
                onClick={() => executePinVerification(enteredPin)}
                disabled={isVerifying || enteredPin.length === 0}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-40 shadow-xl flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying...' : 'Unlock Management Console'}</span>
              </button>
            </div>
          ) : (
            /* AUTHENTICATED MANAGEMENT DASHBOARD: MAXIMUM VERTICAL ROOM FOR EDITING PRODUCTS */
            <div className="flex-1 flex flex-col min-h-0 mt-2 sm:mt-3">
              {/* Executive Segmented Navigation Tabs */}
              <div className="flex items-center gap-1 sm:gap-2 pb-2.5 border-b border-amber-500/15 overflow-x-auto shrink-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                      : 'glass-card text-amber-200/80 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  <Wine className="w-3.5 h-3.5" />
                  <span>Stock & Pricing ({drinks.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('promo')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'promo'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                      : 'glass-card text-amber-200/80 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Promo Banner</span>
                </button>

                <button
                  onClick={() => setActiveTab('hours')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'hours'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                      : 'glass-card text-amber-200/80 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Concierge Hours</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                      : 'glass-card text-amber-200/80 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Guest Reviews ({reviews.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                      : 'glass-card text-amber-200/80 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Vault PIN</span>
                </button>
              </div>

              {/* Scrollable Tab Views: Raised all the way up for maximum editing comfort */}
              <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-4">
                {/* ========================================================= */}
                {/* TAB 1: STOCK & PRICING (MAXIMUM ROOM AT TOP)               */}
                {/* ========================================================= */}
                {activeTab === 'products' && (
                  <div className="space-y-3.5">
                    {/* Header bar with Search and Add Drink CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl glass-card border border-amber-500/25 bg-amber-950/15">
                      <div className="flex-1 min-w-0">
                        <div className="relative">
                          <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search drinks by name, spirit, or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setIsAddingNewDrink(prev => !prev)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>{isAddingNewDrink ? 'Close Form' : 'Add New Cocktail'}</span>
                      </button>
                    </div>

                    {/* Add Drink Collapsible Form */}
                    <AnimatePresence>
                      {isAddingNewDrink && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleAddNewDrink}
                          className="glass-panel p-4 sm:p-5 rounded-3xl border border-amber-500/40 space-y-3.5 bg-black/70 shadow-xl overflow-hidden"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                            <h5 className="font-serif-luxe text-base text-amber-300 font-bold">
                              Craft New Beverage Item for Client Menu
                            </h5>
                            <span className="text-[10px] font-mono text-amber-400 uppercase">Live Integration</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="text-[10px] font-mono text-amber-400 block mb-1">COCKTAIL NAME *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Royal Golden Mist"
                                value={newDrinkForm.name}
                                onChange={(e) => setNewDrinkForm({ ...newDrinkForm, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-amber-400 block mb-1">CATEGORY *</label>
                              <select
                                value={newDrinkForm.category}
                                onChange={(e) => setNewDrinkForm({ ...newDrinkForm, category: e.target.value as any })}
                                className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-black"
                              >
                                <option value="Signature Cocktails">Signature Cocktails</option>
                                <option value="Craft Mocktails">Craft Mocktails</option>
                                <option value="Reserve Spirits">Reserve Spirits</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-amber-400 block mb-1">PRICE (ZMW) *</label>
                              <input
                                type="number"
                                required
                                placeholder="e.g. 175"
                                value={newDrinkForm.price}
                                onChange={(e) => setNewDrinkForm({ ...newDrinkForm, price: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono font-bold"
                              />
                            </div>
                          </div>

                          {/* Picture Selector & Uploader for New Drink */}
                          <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/25 flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 bg-black">
                              <img
                                src={resolveImageUrl(newDrinkForm.image)}
                                alt="Preview"
                                onError={handleImageError}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1.5 w-full">
                              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                                Cocktail Photography
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setIsPhotoPickerOpenFor('new')}
                                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 cursor-pointer"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Choose from Studio Presets</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => newImageFileRef.current?.click()}
                                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload from Device</span>
                                </button>
                                <input
                                  type="file"
                                  ref={newImageFileRef}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, false)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] font-mono text-amber-400 block mb-1">GLASSWARE STYLE</label>
                              <input
                                type="text"
                                placeholder="e.g. Vintage Gold-Rimmed Coupe"
                                value={newDrinkForm.glassware}
                                onChange={(e) => setNewDrinkForm({ ...newDrinkForm, glassware: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-amber-400 block mb-1">FLAVOR PROFILE NOTES</label>
                              <input
                                type="text"
                                placeholder="e.g. Spiced Blood Orange & Smoky Vanilla"
                                value={newDrinkForm.flavorProfile}
                                onChange={(e) => setNewDrinkForm({ ...newDrinkForm, flavorProfile: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-amber-400 block mb-1">BOTANICALS & INGREDIENTS</label>
                            <input
                              type="text"
                              placeholder="Comma separated: Aged Spirit, Citrus Cordial, 24k Gold Leaf"
                              value={newIngredientsInput}
                              onChange={(e) => setNewIngredientsInput(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-amber-400 block mb-1">EDITORIAL DESCRIPTION</label>
                            <textarea
                              rows={2}
                              placeholder="Describe the aroma, palate, and bespoke presentation..."
                              value={newDrinkForm.description}
                              onChange={(e) => setNewDrinkForm({ ...newDrinkForm, description: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/15">
                            <button
                              type="button"
                              onClick={() => setIsAddingNewDrink(false)}
                              className="px-4 py-2 rounded-xl text-xs text-amber-300 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            >
                              Publish to Live Menu
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Drink Cards List */}
                    <div className="space-y-3">
                      {filteredDrinks.map((drink) => {
                        const isEditing = editingDrinkId === drink.id;
                        const isMandatorySignature = drink.id === 'signature-blend' || drink.name.toLowerCase().includes('signature blend');
                        const isAvailable = drink.isAvailable !== false;

                        return (
                          <div
                            key={drink.id}
                            className={`glass-panel p-3.5 sm:p-4 rounded-2xl border transition-all ${
                              isMandatorySignature
                                ? 'border-amber-400/60 bg-gradient-to-r from-amber-950/30 via-black to-amber-950/20 shadow-xl'
                                : 'border-amber-500/20 hover:border-amber-400/40 bg-black/40'
                            }`}
                          >
                            {isEditing ? (
                              /* INLINE EDIT MODE FOR THE SELECTED DRINK */
                              <div className="space-y-3.5">
                                <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                                  <div className="flex items-center gap-2">
                                    <span className="font-serif-luxe text-base font-bold text-white">
                                      Editing: {drink.name}
                                    </span>
                                    {isMandatorySignature && (
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-black font-bold uppercase">
                                        Muko Signature
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setEditingDrinkId(null)}
                                    className="text-xs text-amber-300 hover:text-white cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  <div>
                                    <label className="text-[10px] font-mono text-amber-400 block mb-1">NAME</label>
                                    <input
                                      type="text"
                                      value={editDrinkForm.name || ''}
                                      onChange={(e) => setEditDrinkForm({ ...editDrinkForm, name: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-mono text-amber-400 block mb-1">PRICE (ZMW)</label>
                                    <input
                                      type="number"
                                      value={editDrinkForm.price ?? drink.price}
                                      onChange={(e) => setEditDrinkForm({ ...editDrinkForm, price: Number(e.target.value) })}
                                      className="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-mono font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-mono text-amber-400 block mb-1">CATEGORY</label>
                                    <select
                                      value={editDrinkForm.category || drink.category}
                                      onChange={(e) => setEditDrinkForm({ ...editDrinkForm, category: e.target.value as any })}
                                      className="w-full px-3 py-1.5 rounded-xl glass-input text-xs bg-black"
                                    >
                                      <option value="Signature Cocktails">Signature Cocktails</option>
                                      <option value="Craft Mocktails">Craft Mocktails</option>
                                      <option value="Reserve Spirits">Reserve Spirits</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Picture Switcher for the Drink */}
                                <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/25 flex flex-col sm:flex-row items-center gap-3">
                                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-500/40 shrink-0 bg-black">
                                    <img
                                      src={resolveImageUrl(editDrinkForm.image)}
                                      alt="Drink Preview"
                                      onError={handleImageError}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 space-y-1.5 w-full">
                                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                                      Beverage Photography
                                    </span>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={() => setIsPhotoPickerOpenFor('editing')}
                                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 cursor-pointer"
                                      >
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        <span>Change Photo Preset</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => editImageFileRef.current?.click()}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
                                      >
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Upload Device Photo</span>
                                      </button>
                                      <input
                                        type="file"
                                        ref={editImageFileRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageFileUpload(e, true)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono text-amber-400 block mb-1">INGREDIENTS</label>
                                  <input
                                    type="text"
                                    value={editIngredientsInput}
                                    onChange={(e) => setEditIngredientsInput(e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono text-amber-400 block mb-1">DESCRIPTION</label>
                                  <textarea
                                    rows={2}
                                    value={editDrinkForm.description || ''}
                                    onChange={(e) => setEditDrinkForm({ ...editDrinkForm, description: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
                                  />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/20">
                                  <button
                                    type="button"
                                    onClick={() => setEditingDrinkId(null)}
                                    className="px-3 py-1.5 text-xs text-amber-300 hover:text-white cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => saveDrinkEdit(drink.id)}
                                    className="px-4 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* NORMAL VIEW OF DRINK CARD (WITH DIRECT PRICE & STOCK TOGGLES) */
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  {/* Thumbnail */}
                                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-amber-500/30 shrink-0 bg-black shadow-md group">
                                    <img
                                      src={resolveImageUrl(drink.image)}
                                      alt={drink.name}
                                      onError={handleImageError}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    {isMandatorySignature && (
                                      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                                    )}
                                  </div>

                                  {/* Drink Details */}
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className="font-serif-luxe text-base text-white font-bold truncate">
                                        {drink.name}
                                      </h5>
                                      {isMandatorySignature && (
                                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500 text-black font-bold uppercase">
                                          Signature
                                        </span>
                                      )}
                                      <span
                                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                          isAvailable
                                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                            : 'bg-red-950/60 text-red-300 border-red-500/40'
                                        }`}
                                      >
                                        {isAvailable ? '● In Stock' : '○ Sold Out'}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-amber-200/70 mt-0.5">
                                      <span>{drink.category}</span>
                                      <span>·</span>
                                      <span>{drink.glassware || 'Craft Glassware'}</span>
                                    </div>

                                    <div className="text-[11px] text-amber-300/80 font-mono mt-0.5 truncate">
                                      {drink.ingredients.slice(0, 3).join(', ')}
                                      {drink.ingredients.length > 3 ? '...' : ''}
                                    </div>
                                  </div>
                                </div>

                                {/* Price & Actions Container */}
                                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-500/10">
                                  {/* Kwacha Price Box with Quick Steppers */}
                                  <div className="text-right">
                                    <span className="text-[9px] font-mono text-amber-400/60 uppercase block">Price</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-base font-bold text-amber-300">
                                        ZMW {drink.price.toFixed(2)}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateDrink(drink.id, { price: Math.max(10, drink.price - 10) });
                                          showToast(`✓ Price set to ZMW ${Math.max(10, drink.price - 10)}`);
                                        }}
                                        title="-10 ZMW"
                                        className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-amber-300 text-[10px] flex items-center justify-center font-mono cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateDrink(drink.id, { price: drink.price + 10 });
                                          showToast(`✓ Price set to ZMW ${drink.price + 10}`);
                                        }}
                                        title="+10 ZMW"
                                        className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-amber-300 text-[10px] flex items-center justify-center font-mono cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1.5">
                                    {/* Availability toggle */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateDrink(drink.id, { isAvailable: !isAvailable });
                                        showToast(
                                          !isAvailable
                                            ? `✓ "${drink.name}" marked IN STOCK`
                                            : `✓ "${drink.name}" marked SOLD OUT`
                                        );
                                      }}
                                      title={isAvailable ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        isAvailable
                                          ? 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
                                          : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                                      }`}
                                    >
                                      {isAvailable ? 'Stocked' : 'Restock'}
                                    </button>

                                    {/* Edit button */}
                                    <button
                                      type="button"
                                      onClick={() => startEditDrink(drink)}
                                      title="Edit drink details"
                                      className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 cursor-pointer transition-colors"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete button (except signature blend) */}
                                    {!isMandatorySignature && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setDeleteConfirmation({
                                            type: 'drink',
                                            id: drink.id,
                                            title: drink.name
                                          })
                                        }
                                        title="Delete drink"
                                        className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 cursor-pointer transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: PROMOTIONAL RIBBON SUITE                          */}
                {/* ========================================================= */}
                {activeTab === 'promo' && (
                  <div className="space-y-4 max-w-2xl">
                    <div className="p-3.5 rounded-2xl glass-card border border-amber-500/25 bg-amber-950/15">
                      <h4 className="font-serif-luxe text-lg text-white font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span>Live Promotional Banner Manager</span>
                      </h4>
                      <p className="text-xs text-amber-200/70 mt-0.5">
                        This message appears directly at the very top of the live website for all visiting customers.
                      </p>
                    </div>

                    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 space-y-4 bg-black/50">
                      {/* Active Toggle */}
                      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                        <div>
                          <span className="text-xs font-mono text-white font-semibold block">Banner Visibility</span>
                          <span className="text-[11px] text-amber-200/60">Toggle to show or hide the top promotion</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPromoActiveInput(prev => !prev)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                            promoActiveInput
                              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {promoActiveInput ? '● Visible on Site' : '○ Hidden'}
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-amber-400 block mb-1">PROMOTIONAL TAG / BADGE</label>
                        <input
                          type="text"
                          value={promoTagInput}
                          onChange={(e) => setPromoTagInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                          placeholder="e.g. VIP TASTING"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-amber-400 block mb-1">PROMOTIONAL HEADLINE MESSAGE</label>
                        <textarea
                          rows={3}
                          value={promoMessageInput}
                          onChange={(e) => setPromoMessageInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                          placeholder="e.g. Complimentary Signature Blend bar styling included with every 2026 wedding booking."
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-amber-400 block mb-1">CALL TO ACTION BUTTON TEXT</label>
                        <input
                          type="text"
                          value={promoCtaInput}
                          onChange={(e) => setPromoCtaInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                          placeholder="e.g. Reserve Concierge"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSavePromo}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                      >
                        Publish Banner to Website
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: OPERATING HOURS & DISPATCH                        */}
                {/* ========================================================= */}
                {activeTab === 'hours' && (
                  <div className="space-y-4 max-w-2xl">
                    <div className="p-3.5 rounded-2xl glass-card border border-amber-500/25 bg-amber-950/15">
                      <h4 className="font-serif-luxe text-lg text-white font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <span>Concierge Operating & Dispatch Hours</span>
                      </h4>
                      <p className="text-xs text-amber-200/70 mt-0.5">
                        Updates the official dispatch hours displayed on the contact card.
                      </p>
                    </div>

                    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 space-y-4 bg-black/50">
                      <div>
                        <label className="text-[10px] font-mono text-amber-400 block mb-1">OPERATING HOURS STATEMENT</label>
                        <input
                          type="text"
                          value={hoursInput}
                          onChange={(e) => setHoursInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                          placeholder="e.g. Wednesday to Sunday · 16:00 - 02:00"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/80">
                        <span className="font-bold text-amber-300 block mb-1">Live Display Preview:</span>
                        <span>Official Operating Hours: <strong className="font-mono text-white">{hoursInput}</strong></span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveHours}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                      >
                        Update Operating Hours Live
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 4: GUEST REVIEWS & FEEDBACK                           */}
                {/* ========================================================= */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl glass-card border border-amber-500/25 bg-amber-950/15 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif-luxe text-lg text-white font-bold flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          <span>Guest Reviews & Testimonials</span>
                        </h4>
                        <p className="text-xs text-amber-200/70 mt-0.5">
                          Curate client feedback displayed in the About Us modal and credibility sections.
                        </p>
                      </div>
                      <span className="font-mono text-xs text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                        {reviews.length} Total
                      </span>
                    </div>

                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-serif-luxe text-base font-bold text-white">
                                {rev.clientName}
                              </span>
                              <span className="text-xs text-amber-400/70 font-mono">({rev.eventType})</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                              ))}
                            </div>
                            <p className="text-xs text-amber-100/80 italic">&ldquo;{rev.reviewText}&rdquo;</p>
                            <span className="text-[10px] text-amber-400/50 font-mono">{rev.date}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                toggleReviewFeatured(rev.id);
                                showToast(
                                  rev.isFeatured
                                    ? '✓ Review hidden from public view'
                                    : '✓ Review featured on live site'
                                );
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                rev.isFeatured
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-white/5 text-white/40 border border-white/10'
                              }`}
                            >
                              {rev.isFeatured ? 'Displayed on Site' : 'Hidden'}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmation({
                                  type: 'review',
                                  id: rev.id,
                                  title: rev.clientName
                                })
                              }
                              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 5: SECURITY & VAULT PIN                               */}
                {/* ========================================================= */}
                {activeTab === 'security' && (
                  <div className="space-y-4 max-w-xl">
                    <div className="p-3.5 rounded-2xl glass-card border border-amber-500/25 bg-amber-950/15">
                      <h4 className="font-serif-luxe text-lg text-white font-bold flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-amber-400" />
                        <span>Terminal Security & Staff PIN</span>
                      </h4>
                      <p className="text-xs text-amber-200/70 mt-0.5">
                        Change the secret PIN required to unlock this console.
                      </p>
                    </div>

                    <form onSubmit={handleChangePinSubmit} className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 space-y-4 bg-black/50">
                      {pinChangeSuccess && (
                        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Staff PIN successfully changed and secured.</span>
                        </div>
                      )}

                      {pinChangeError && (
                        <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                          {pinChangeError}
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-mono text-amber-400 uppercase block mb-1">
                          NEW SECURITY PIN *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={16}
                          placeholder="Enter new secret PIN"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono tracking-widest"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-amber-400 uppercase block mb-1">
                          CONFIRM NEW SECURITY PIN *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={16}
                          placeholder="Re-type new secret PIN"
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono tracking-widest"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Update Security Access PIN</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
