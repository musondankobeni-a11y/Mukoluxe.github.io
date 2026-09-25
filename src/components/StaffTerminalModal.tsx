import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  X,
  FileText,
  Wine,
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  Trash2,
  Plus,
  Edit2,
  Save,
  LogOut,
  Send,
  Download,
  Upload,
  Image as ImageIcon,
  KeyRound,
  Shield
} from 'lucide-react';
import { DrinkItem, OrderTicket } from '../types';
import { downloadOrderTicket } from '../utils/ticketDownload';

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
    tickets,
    updateTicketStatus,
    deleteTicket,
    sendFeedbackPromptForTicket,
    promo,
    updatePromoBanner,
    reviews,
    toggleReviewFeatured,
    deleteReview
  } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'products' | 'promo' | 'hours' | 'reviews' | 'security'>('tickets');

  // Change PIN state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  // Edit drink form
  const [editingDrinkId, setEditingDrinkId] = useState<string | null>(null);
  const [editDrinkForm, setEditDrinkForm] = useState<Partial<DrinkItem>>({});
  const [editIngredientsInput, setEditIngredientsInput] = useState('');

  // Add new drink form
  const [isAddingNewDrink, setIsAddingNewDrink] = useState(false);
  const [newDrinkForm, setNewDrinkForm] = useState<Omit<DrinkItem, 'id'>>({
    name: '',
    category: 'Signature Cocktails',
    description: '',
    ingredients: [],
    price: 150,
    image: '/src/assets/images/cocktail_signature_blend_1790315318909.jpg',
    isAvailable: true,
    isSignature: false,
    flavorProfile: '',
    glassware: 'Crystal Glass'
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
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { verifyStaffPin } = useApp();

  if (!isStaffModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin.trim() || isVerifying) return;
    setIsVerifying(true);
    setAuthErrorMessage('');

    const result = await verifyStaffPin(enteredPin.trim());
    setIsVerifying(false);

    if (result.success) {
      setPinError(false);
      setEnteredPin('');
      setAuthErrorMessage('');
    } else {
      setPinError(true);
      setAuthErrorMessage(result.error || 'Authentication failed. Invalid staff PIN.');
    }
  };

  const handleLogout = () => {
    setIsStaffLoggedIn(false);
    setEnteredPin('');
    setPinError(false);
    setAuthErrorMessage('');
  };

  const handleSaveHours = () => {
    updateSettings({ openingHours: hoursInput });
    alert('Opening hours updated successfully on the live site!');
  };

  const handleSavePromo = () => {
    updatePromoBanner({
      isActive: promoActiveInput,
      message: promoMessageInput,
      tag: promoTagInput,
      ctaText: promoCtaInput
    });
    alert('Promotional banner updated successfully on the live site!');
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
      ingredients: updatedIngredients.length > 0 ? updatedIngredients : editDrinkForm.ingredients
    });
    setEditingDrinkId(null);
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
      ingredients: parsedIng.length > 0 ? parsedIng : ['Premium Spirit', 'Artisanal Mixer']
    });

    setIsAddingNewDrink(false);
    setNewDrinkForm({
      name: '',
      category: 'Signature Cocktails',
      description: '',
      ingredients: [],
      price: 150,
      image: '/src/assets/images/cocktail_signature_blend_1790315318909.jpg',
      isAvailable: true,
      isSignature: false,
      flavorProfile: '',
      glassware: 'Crystal Glass'
    });
    setNewIngredientsInput('');
  };

  const sampleCocktailImages = [
    '/src/assets/images/cocktail_signature_blend_1790315318909.jpg',
    '/src/assets/images/cocktail_smoked_old_fashioned_1790315331376.jpg',
    '/src/assets/images/cocktail_berry_bramble_1790315347337.jpg',
    '/src/assets/images/cocktail_velvet_martini_1790315357768.jpg',
    '/src/assets/images/cocktail_hero_luxury_1790315307049.jpg'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
          onClick={() => setIsStaffModalOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl border border-amber-500/40 p-5 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                {isStaffLoggedIn ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                  Muko Luxe Terminal
                </span>
                <h2 className="font-serif-luxe text-xl sm:text-2xl text-white font-bold">
                  {isStaffLoggedIn ? 'Staff Management Dashboard' : 'Staff Login Terminal'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isStaffLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="w-9 h-9 rounded-xl border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-white hover:bg-amber-500/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isStaffLoggedIn ? (
            /* SECURE PIN ENTRY SCREEN (NO PIN REVEALED) */
            <div className="py-12 max-w-md mx-auto w-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>

              <h3 className="font-serif-luxe text-2xl text-white font-bold">
                Staff Authentication
              </h3>

              <p className="text-xs text-amber-200/70 mt-1 mb-6">
                Please enter your employee security PIN to access the manager terminal.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  maxLength={16}
                  autoFocus
                  placeholder="Enter Security PIN"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3.5 rounded-xl glass-input"
                />

                {pinError && (
                  <p className="text-xs text-red-400 font-mono">
                    {authErrorMessage || 'Authentication failed. Invalid staff PIN.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying Security PIN...' : 'Verify Credentials'}
                </button>
              </form>
            </div>
          ) : (
            /* STAFF MANAGEMENT DASHBOARD */
            <div className="flex-1 flex flex-col min-h-0 mt-4">
              {/* Terminal Tabs */}
              <div className="flex items-center gap-1 sm:gap-2 pb-3 border-b border-amber-500/15 overflow-x-auto shrink-0">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === 'tickets'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'glass-card text-amber-200/80 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Order Tickets ({tickets.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === 'products'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'glass-card text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Wine className="w-3.5 h-3.5" />
                  <span>Cocktails & Pictures</span>
                </button>

                <button
                  onClick={() => setActiveTab('promo')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === 'promo'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'glass-card text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Promotion Banner</span>
                </button>

                <button
                  onClick={() => setActiveTab('hours')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === 'hours'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'glass-card text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Opening Hours</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'glass-card text-amber-200/80 hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Reviews ({reviews.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeTab === 'security'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'glass-card text-amber-200/80 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change PIN</span>
                </button>
              </div>

              {/* Scrollable Tab Body */}
              <div className="flex-1 overflow-y-auto pt-4 pr-1">
                {/* TAB 1: ORDER TICKETS (DOWNLOAD & DELETE CAPABILITY) */}
                {activeTab === 'tickets' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-amber-300">
                      <span>Real-time dispatch tickets. You can update progress, download, or delete tickets.</span>
                      <span className="font-mono">{tickets.length} Registered</span>
                    </div>

                    {tickets.length === 0 ? (
                      <div className="text-center py-12 text-amber-300/50">
                        No customer tickets yet.
                      </div>
                    ) : (
                      tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="glass-card p-4 sm:p-5 rounded-2xl border border-amber-500/25 space-y-3"
                        >
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-amber-300">
                                  {ticket.ticketNumber}
                                </span>
                                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                                  ticket.status === 'Completed'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : ticket.status === 'Confirmed'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                    : ticket.status === 'Cancelled'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}>
                                  {ticket.status}
                                </span>
                              </div>
                              <h4 className="font-serif-luxe text-base text-white font-bold mt-1">
                                {ticket.clientName} · {ticket.eventType}
                              </h4>
                            </div>

                            {/* Status Change Selector & Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-amber-400/80 font-mono">Status:</span>
                                <select
                                  value={ticket.status}
                                  onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                                  className="px-2 py-1 rounded-lg glass-input text-xs bg-black"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Bar Planning">Bar Planning</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>

                              {/* DOWNLOAD TICKET BUTTON */}
                              <button
                                onClick={() => downloadOrderTicket(ticket)}
                                title="Download Official Ticket"
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1 border border-amber-500/30 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-amber-400" />
                                <span>Download</span>
                              </button>

                              {/* DELETE TICKET BUTTON */}
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ticket ${ticket.ticketNumber}?`)) {
                                    deleteTicket(ticket.id);
                                  }
                                }}
                                title="Delete Ticket"
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-500/30 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Ticket Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-amber-200/80 pt-2 border-t border-white/5">
                            <div>
                              <span className="text-amber-400/50 block font-mono text-[10px]">PHONE</span>
                              <span>{ticket.clientPhone}</span>
                            </div>
                            <div>
                              <span className="text-amber-400/50 block font-mono text-[10px]">EVENT DATE</span>
                              <span>{ticket.eventDate}</span>
                            </div>
                            <div>
                              <span className="text-amber-400/50 block font-mono text-[10px]">LOCATION</span>
                              <span className="truncate block">{ticket.location}</span>
                            </div>
                            <div>
                              <span className="text-amber-400/50 block font-mono text-[10px]">GUESTS</span>
                              <span>{ticket.guestCount} Attendees</span>
                            </div>
                            <div>
                              <span className="text-amber-400/50 block font-mono text-[10px]">TOTAL PRICE</span>
                              <span className="font-bold text-amber-300 font-mono">
                                ZMW {(ticket.totalPrice || ticket.selectedDrinks.reduce((acc, d) => acc + (d.price || 0), 0)).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Selected Drinks */}
                          <div className="text-xs">
                            <span className="text-amber-400/50 font-mono text-[10px] block mb-1">
                              REQUESTED DRINKS & MIXERS
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {ticket.selectedDrinks.map((d, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-200 border border-amber-500/20 text-[11px]"
                                >
                                  {d.name} {d.price ? `(ZMW ${d.price.toFixed(2)})` : ''}
                                </span>
                              ))}
                            </div>
                          </div>

                          {ticket.specialNotes && (
                            <p className="text-xs text-amber-200/60 italic bg-black/30 p-2 rounded">
                              &ldquo;{ticket.specialNotes}&rdquo;
                            </p>
                          )}

                          {/* Feedback status and trigger button */}
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Star className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-amber-300">
                                Feedback Status: <strong className="font-mono">{ticket.feedbackStatus || 'Not Sent'}</strong>
                              </span>
                              {ticket.feedback && (
                                <span className="text-emerald-400 font-medium">
                                  ({ticket.feedback.rating}/5 Stars: &quot;{ticket.feedback.reviewText}&quot;)
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => sendFeedbackPromptForTicket(ticket.id)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 cursor-pointer"
                            >
                              <Send className="w-3 h-3 text-amber-400" />
                              <span>Trigger Event Feedback Prompt</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 2: PRODUCTS, LIVE PRICING & COCKTAIL PICTURES (INCLUDING SIGNATURE BLEND) */}
                {activeTab === 'products' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif-luxe text-lg text-white font-bold">
                          Cocktails, Signature Blend & Pictures
                        </h4>
                        <p className="text-xs text-amber-200/70">
                          Edit prices, names, and change cocktail pictures (upload or choose preset photos).
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddingNewDrink(prev => !prev)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Cocktail</span>
                      </button>
                    </div>

                    {/* Add Drink Form */}
                    {isAddingNewDrink && (
                      <form onSubmit={handleAddNewDrink} className="glass-panel p-5 rounded-2xl border border-amber-500/40 space-y-4">
                        <h5 className="font-serif-luxe text-base text-amber-300 font-bold">
                          Create New Artisanal Cocktail / Mocktail
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Cocktail Name"
                            value={newDrinkForm.name}
                            onChange={(e) => setNewDrinkForm({ ...newDrinkForm, name: e.target.value })}
                            className="px-3 py-2 rounded-lg glass-input text-xs"
                          />
                          <select
                            value={newDrinkForm.category}
                            onChange={(e) => setNewDrinkForm({ ...newDrinkForm, category: e.target.value as any })}
                            className="px-3 py-2 rounded-lg glass-input text-xs bg-black"
                          >
                            <option value="Signature Cocktails">Signature Cocktails</option>
                            <option value="Craft Mocktails">Craft Mocktails</option>
                            <option value="Reserve Spirits">Reserve Spirits</option>
                            <option value="Bar Packages">Bar Packages</option>
                          </select>
                          <input
                            type="number"
                            required
                            placeholder="Price (ZMW)"
                            value={newDrinkForm.price}
                            onChange={(e) => setNewDrinkForm({ ...newDrinkForm, price: Number(e.target.value) })}
                            className="px-3 py-2 rounded-lg glass-input text-xs font-mono"
                          />
                        </div>

                        {/* Picture Upload & URL for New Drink */}
                        <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                            Cocktail Picture (Upload or Preset)
                          </span>
                          <div className="flex items-center gap-3">
                            <img
                              src={newDrinkForm.image}
                              alt="Preview"
                              className="w-14 h-14 rounded-lg object-cover border border-amber-500/30 shrink-0"
                            />
                            <div className="flex-1 space-y-1.5">
                              <input
                                type="file"
                                ref={newImageFileRef}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageFileUpload(e, false)}
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => newImageFileRef.current?.click()}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Photo from Device</span>
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Or paste image URL"
                                value={newDrinkForm.image}
                                onChange={(e) => setNewDrinkForm({ ...newDrinkForm, image: e.target.value })}
                                className="w-full px-2.5 py-1 rounded glass-input text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Glassware Style (e.g. Vintage Coupe)"
                            value={newDrinkForm.glassware}
                            onChange={(e) => setNewDrinkForm({ ...newDrinkForm, glassware: e.target.value })}
                            className="px-3 py-2 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Flavor Profile (e.g. Crisp, Citrus)"
                            value={newDrinkForm.flavorProfile}
                            onChange={(e) => setNewDrinkForm({ ...newDrinkForm, flavorProfile: e.target.value })}
                            className="px-3 py-2 rounded-lg glass-input text-xs"
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Ingredients (comma separated: Spirit, Lime, Bitters)"
                          value={newIngredientsInput}
                          onChange={(e) => setNewIngredientsInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />

                        <textarea
                          rows={2}
                          placeholder="Description of the drink..."
                          value={newDrinkForm.description}
                          onChange={(e) => setNewDrinkForm({ ...newDrinkForm, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingNewDrink(false)}
                            className="px-3 py-1.5 text-xs text-amber-300 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-semibold cursor-pointer"
                          >
                            Save Drink to Live Menu
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Drink List with Inline Editing & Picture Changer */}
                    <div className="space-y-4">
                      {drinks.map((drink) => {
                        const isEditing = editingDrinkId === drink.id;
                        const isSignatureBlend = drink.id === 'signature-blend' || drink.name.toLowerCase().includes('signature blend');

                        return (
                          <div
                            key={drink.id}
                            className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all ${
                              isSignatureBlend ? 'border-amber-400/60 bg-amber-950/20' : 'border-amber-500/20'
                            }`}
                          >
                            {isEditing ? (
                              /* FULL EDIT MODE FOR ANY COCKTAIL (INCLUDING SIGNATURE BLEND) */
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                                  <div className="flex items-center gap-2">
                                    <span className="font-serif-luxe text-base font-bold text-white">
                                      Editing: {drink.name}
                                    </span>
                                    {isSignatureBlend && (
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-black font-bold">
                                        Signature Blend
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setEditingDrinkId(null)}
                                    className="text-xs text-amber-300 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[10px] font-mono text-amber-400 block mb-1">NAME</label>
                                    <input
                                      type="text"
                                      value={editDrinkForm.name || ''}
                                      onChange={(e) => setEditDrinkForm({ ...editDrinkForm, name: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded glass-input text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-mono text-amber-400 block mb-1">PRICE (ZMW)</label>
                                    <input
                                      type="number"
                                      value={editDrinkForm.price ?? drink.price}
                                      onChange={(e) => setEditDrinkForm({ ...editDrinkForm, price: Number(e.target.value) })}
                                      className="w-full px-3 py-1.5 rounded glass-input text-xs font-mono"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-mono text-amber-400 block mb-1">CATEGORY</label>
                                    <select
                                      value={editDrinkForm.category || drink.category}
                                      onChange={(e) => setEditDrinkForm({ ...editDrinkForm, category: e.target.value as any })}
                                      className="w-full px-3 py-1.5 rounded glass-input text-xs bg-black"
                                    >
                                      <option value="Signature Cocktails">Signature Cocktails</option>
                                      <option value="Craft Mocktails">Craft Mocktails</option>
                                      <option value="Reserve Spirits">Reserve Spirits</option>
                                      <option value="Bar Packages">Bar Packages</option>
                                    </select>
                                  </div>
                                </div>

                                {/* CHANGE PICTURE SECTION */}
                                <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                                    Change Cocktail Picture
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={editDrinkForm.image || drink.image}
                                      alt="Current"
                                      className="w-16 h-16 rounded-xl object-cover border border-amber-500/40 shrink-0"
                                    />
                                    <div className="flex-1 space-y-2">
                                      <input
                                        type="file"
                                        ref={editImageFileRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageFileUpload(e, true)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => editImageFileRef.current?.click()}
                                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 cursor-pointer"
                                      >
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Upload New Picture from Device</span>
                                      </button>

                                      <input
                                        type="text"
                                        placeholder="Or paste direct image URL"
                                        value={editDrinkForm.image || ''}
                                        onChange={(e) => setEditDrinkForm({ ...editDrinkForm, image: e.target.value })}
                                        className="w-full px-2.5 py-1 rounded glass-input text-xs"
                                      />

                                      {/* Preset Photos */}
                                      <div className="flex items-center gap-1.5 pt-1">
                                        <span className="text-[10px] text-amber-400/60 font-mono">Presets:</span>
                                        {sampleCocktailImages.map((imgUrl, idx) => (
                                          <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setEditDrinkForm({ ...editDrinkForm, image: imgUrl })}
                                            className="w-6 h-6 rounded border border-amber-500/30 overflow-hidden hover:scale-110 transition-transform"
                                          >
                                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono text-amber-400 block mb-1">INGREDIENTS</label>
                                  <input
                                    type="text"
                                    value={editIngredientsInput}
                                    onChange={(e) => setEditIngredientsInput(e.target.value)}
                                    placeholder="Comma separated ingredients"
                                    className="w-full px-3 py-1.5 rounded glass-input text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono text-amber-400 block mb-1">DESCRIPTION</label>
                                  <textarea
                                    rows={2}
                                    value={editDrinkForm.description || ''}
                                    onChange={(e) => setEditDrinkForm({ ...editDrinkForm, description: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded glass-input text-xs"
                                  />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                                  <button
                                    onClick={() => setEditingDrinkId(null)}
                                    className="px-3 py-1.5 text-xs text-amber-300 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => saveDrinkEdit(drink.id)}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Updates to Live Site</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* NORMAL VIEW MODE */
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={drink.image}
                                    alt={drink.name}
                                    className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-serif-luxe text-base font-bold text-white">
                                        {drink.name}
                                      </span>
                                      {isSignatureBlend && (
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-black font-bold">
                                          Signature Blend
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-amber-200/60 line-clamp-1">{drink.description}</p>
                                    <span className="text-[11px] font-mono text-amber-400/80">
                                      {drink.glassware} · {drink.flavorProfile}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                  <div className="text-right">
                                    <span className="text-[10px] font-mono text-amber-400/60 block">PRICE</span>
                                    <span className="text-sm font-mono font-bold text-amber-300">
                                      ZMW {drink.price.toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Availability Toggle */}
                                  <button
                                    onClick={() => updateDrink(drink.id, { isAvailable: !drink.isAvailable })}
                                    className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                                      drink.isAvailable
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}
                                  >
                                    {drink.isAvailable ? 'In Stock' : 'Unavailable'}
                                  </button>

                                  {/* Edit Drink Button (WORKS FOR ALL COCKTAILS INCLUDING SIGNATURE BLEND) */}
                                  <button
                                    onClick={() => startEditDrink(drink)}
                                    title="Edit Drink & Change Picture"
                                    className="p-2 text-amber-300 hover:text-white rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 text-xs cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete cocktail "${drink.name}"?`)) {
                                        deleteDrink(drink.id);
                                      }
                                    }}
                                    className="p-2 text-red-400/60 hover:text-red-300 rounded-lg hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: PROMOTION BANNER SPACE */}
                {activeTab === 'promo' && (
                  <div className="space-y-5 max-w-2xl">
                    <div>
                      <h4 className="font-serif-luxe text-lg text-white font-bold">
                        Dedicated Promotion Banner Space
                      </h4>
                      <p className="text-xs text-amber-200/70">
                        Push seasonal deals, wedding discounts, and special announcements on the top header banner.
                      </p>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-amber-500/25 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-amber-300">
                          Banner Display Status
                        </span>
                        <button
                          type="button"
                          onClick={() => setPromoActiveInput(!promoActiveInput)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            promoActiveInput
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/10 text-white/50 border border-white/10'
                          }`}
                        >
                          {promoActiveInput ? 'Active on Live Site' : 'Hidden / Inactive'}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
                          Promotion Badge Tag
                        </label>
                        <input
                          type="text"
                          value={promoTagInput}
                          onChange={(e) => setPromoTagInput(e.target.value)}
                          placeholder="e.g. EVENT PROMOTION"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
                          Announcement / Deal Text
                        </label>
                        <textarea
                          rows={3}
                          value={promoMessageInput}
                          onChange={(e) => setPromoMessageInput(e.target.value)}
                          placeholder="Describe the limited deal..."
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
                          Call To Action Button Label
                        </label>
                        <input
                          type="text"
                          value={promoCtaInput}
                          onChange={(e) => setPromoCtaInput(e.target.value)}
                          placeholder="e.g. Reserve Concierge"
                          className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                        />
                      </div>

                      <button
                        onClick={handleSavePromo}
                        className="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Changes to Live Site</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: OPENING HOURS */}
                {activeTab === 'hours' && (
                  <div className="space-y-5 max-w-2xl">
                    <div>
                      <h4 className="font-serif-luxe text-lg text-white font-bold">
                        Edit Opening Hours & Service Times
                      </h4>
                      <p className="text-xs text-amber-200/70">
                        Updates operating hours displayed live in Section 4 (Booking & Location).
                      </p>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-amber-500/25 space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
                          Opening Hours String
                        </label>
                        <textarea
                          rows={3}
                          value={hoursInput}
                          onChange={(e) => setHoursInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                        />
                      </div>

                      <button
                        onClick={handleSaveHours}
                        className="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Live Hours</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 5: CLIENT REVIEWS (FEATURE & DELETE REVIEWS) */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-amber-300">
                      <span>Customer Reviews Moderation</span>
                      <span>Manage testimonials and delete unwanted reviews</span>
                    </div>

                    <div className="space-y-3">
                      {reviews.length === 0 ? (
                        <div className="text-center py-10 text-amber-300/50">
                          No customer reviews logged yet.
                        </div>
                      ) : (
                        reviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="glass-card p-4 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm">{rev.clientName}</span>
                                <span className="text-xs text-amber-400 font-mono">({rev.eventType})</span>
                                <div className="flex items-center text-amber-400">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-amber-100/80 mt-1 italic">&ldquo;{rev.reviewText}&rdquo;</p>
                              <span className="text-[10px] text-amber-400/50 font-mono">{rev.date}</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => toggleReviewFeatured(rev.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                  rev.isFeatured
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-white/5 text-white/40 border border-white/10'
                                }`}
                              >
                                {rev.isFeatured ? 'Displayed on Site' : 'Hidden from Site'}
                              </button>

                              {/* DELETE REVIEW BUTTON */}
                              <button
                                onClick={() => {
                                  if (confirm(`Delete review from "${rev.clientName}"?`)) {
                                    deleteReview(rev.id);
                                  }
                                }}
                                title="Delete Review"
                                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-500/30 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 6: SECURITY & CHANGE PIN */}
                {activeTab === 'security' && (
                  <div className="space-y-5 max-w-xl">
                    <div>
                      <h4 className="font-serif-luxe text-lg text-white font-bold flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-amber-400" />
                        <span>Change Staff Security PIN</span>
                      </h4>
                      <p className="text-xs text-amber-200/70 mt-1">
                        Update your employee security credentials. The new PIN will take effect immediately.
                      </p>
                    </div>

                    <form onSubmit={handleChangePinSubmit} className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-4">
                      {pinChangeSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Staff PIN successfully changed! Your new PIN is now active.</span>
                        </div>
                      )}

                      {pinChangeError && (
                        <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300">
                          {pinChangeError}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                          New Security PIN *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={16}
                          placeholder="Enter new PIN"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono tracking-widest"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                          Confirm New Security PIN *
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={16}
                          placeholder="Repeat new PIN"
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono tracking-widest"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Update Staff Security PIN</span>
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
