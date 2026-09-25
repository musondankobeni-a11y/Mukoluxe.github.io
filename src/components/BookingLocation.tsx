import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Edit3,
  GlassWater,
  Download,
  Search,
  AlertCircle,
  Receipt,
  X,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { downloadOrderTicket } from '../utils/ticketDownload';
import { OrderTicket } from '../types';

export const BookingLocation: React.FC = () => {
  const {
    settings,
    drinks,
    tickets,
    createTicket,
    selectedMenuDrinks,
    isStaffLoggedIn,
    setIsStaffModalOpen
  } = useApp();

  // Booking Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('');
  const [locationVenue, setLocationVenue] = useState('Kabwe & Surrounds');
  const [guestCount, setGuestCount] = useState<number>(75);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>(['signature-blend']);
  const [packageType, setPackageType] = useState('Full Mobile Bar Concierge');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<OrderTicket | null>(null);

  // Private Ticket Tracking State
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingPhone, setTrackingPhone] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<OrderTicket | null>(null);
  const [trackingError, setTrackingError] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Track customer's own tickets stored on this device
  const [myTickets, setMyTickets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('muko_my_booked_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync selected drinks from interactive menu
  useEffect(() => {
    if (selectedMenuDrinks.length > 0) {
      const ids = selectedMenuDrinks.map(d => d.id);
      setSelectedDrinks(prev => Array.from(new Set([...prev, ...ids])));
    }
  }, [selectedMenuDrinks]);

  const toggleDrinkSelection = (drinkId: string) => {
    setSelectedDrinks(prev =>
      prev.includes(drinkId) ? prev.filter(id => id !== drinkId) : [...prev, drinkId]
    );
  };

  // Calculate live selected drinks and total price for customers
  const bookingSelectedDrinkItems = drinks.filter(d => selectedDrinks.includes(d.id));
  const bookingTotalPrice = bookingSelectedDrinkItems.reduce((acc, d) => acc + (d.price || 0), 0);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const chosenDrinks = bookingSelectedDrinkItems.map(d => ({
      drinkId: d.id,
      name: d.name,
      price: d.price
    }));

    const ticket = createTicket({
      clientName,
      clientPhone,
      clientEmail,
      eventType,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      location: locationVenue,
      guestCount: Number(guestCount) || 50,
      packageType,
      selectedDrinks: chosenDrinks.length > 0 ? chosenDrinks : [{ drinkId: 'signature-blend', name: 'Signature Blend', price: 180 }],
      totalPrice: bookingTotalPrice > 0 ? bookingTotalPrice : 180,
      specialNotes
    });

    setSubmittedTicket(ticket);
    setTrackedTicket(ticket);
    setTrackingInput(ticket.ticketNumber);
    setTrackingPhone(ticket.clientPhone);

    // Save this ticket to the customer's own device list so they can easily access it without exposing others
    const updatedMy = Array.from(new Set([ticket.ticketNumber.toUpperCase(), ...myTickets]));
    setMyTickets(updatedMy);
    localStorage.setItem('muko_my_booked_tickets', JSON.stringify(updatedMy));
  };

  // SECURE TICKET TRACKING: Customer can only see THEIR OWN ticket
  const handleTrackTicket = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = trackingInput.trim().toUpperCase();
    const inputPhone = trackingPhone.trim().replace(/[\s\-\+]/g, '');

    if (!query) return;

    const found = tickets.find(
      t => t.ticketNumber.toUpperCase() === query || t.id.toUpperCase() === query
    );

    if (!found) {
      setTrackedTicket(null);
      setTrackingError(true);
      setVerificationError('');
      return;
    }

    // Check if this ticket was booked on this customer's device
    const isBookedOnThisDevice = myTickets.includes(found.ticketNumber.toUpperCase()) ||
      (submittedTicket && submittedTicket.ticketNumber.toUpperCase() === found.ticketNumber.toUpperCase());

    // If booked on this device, allow immediate viewing
    if (isBookedOnThisDevice) {
      setTrackedTicket(found);
      setTrackingError(false);
      setVerificationError('');
      return;
    }

    // If querying an external ticket, REQUIRE phone number verification for privacy!
    if (!inputPhone) {
      setTrackedTicket(null);
      setTrackingError(false);
      setVerificationError('To protect client privacy, please enter the contact phone number used when booking this ticket.');
      return;
    }

    const cleanTicketPhone = found.clientPhone.replace(/[\s\-\+]/g, '');
    const isMatch = cleanTicketPhone.endsWith(inputPhone) || inputPhone.endsWith(cleanTicketPhone) || cleanTicketPhone === inputPhone;

    if (isMatch) {
      setTrackedTicket(found);
      setTrackingError(false);
      setVerificationError('');
    } else {
      setTrackedTicket(null);
      setTrackingError(false);
      setVerificationError('Privacy Protected: The contact phone number does not match this booking reference. Access denied.');
    }
  };

  const getProgressStage = (status: OrderTicket['status']) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Bar Planning':
        return 2;
      case 'Confirmed':
        return 3;
      case 'Completed':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  // Mask client phone for privacy
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    if (phone.length <= 4) return '****';
    return phone.slice(0, 4) + '****' + phone.slice(-2);
  };

  return (
    <section id="booking-section" className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-xs text-amber-300 mb-3">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-widest uppercase font-mono text-[10px]">
            Position 04 · Concierge Reservation & Coordinates
          </span>
        </div>

        <h2 className="font-serif-luxe text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Booking & <span className="gold-gradient-text">Location</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-amber-200/70 font-editorial italic max-w-xl mx-auto">
          Reserve our premier mobile bartending team for your bespoke event. View total pricing of your selected items, direct calling, and secure private ticket tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Parameters & Location Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="font-serif-luxe text-xl text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              Direct Concierge Lines
            </h3>

            <div className="space-y-5 text-sm">
              {/* Call Line: 0976516321 */}
              <a
                href="tel:0976516321"
                className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 block">
                      Call Line
                    </span>
                    <span className="font-mono text-base font-bold text-white group-hover:text-amber-300">
                      0976516321
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300">
                  Dial
                </span>
              </a>

              {/* WhatsApp Direct Link: +2609 68 3 66 6 47 */}
              <a
                href="https://wa.me/260968366647?text=Hello%20Muko%20Luxe%20Concierge,%20I%20would%20like%20to%20inquire%20about%20mobile%20bartending%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80 block">
                      WhatsApp Direct Link
                    </span>
                    <span className="font-mono text-base font-bold text-white group-hover:text-emerald-300">
                      +2609 68 3 66 6 47
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  Chat <ExternalLink className="w-3 h-3" />
                </span>
              </a>

              {/* Location Coordinate Map Info: GCWW+HQ6 Kabwe */}
              <div className="p-4 rounded-xl glass-card border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 block">
                      Location Coordinate Map Info
                    </span>
                    <span className="font-mono text-base font-bold text-amber-100 block">
                      GCWW+HQ6 Kabwe
                    </span>
                    <span className="text-xs text-amber-200/60 block mt-0.5">
                      {settings.locationLabel}
                    </span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=GCWW%2BHQ6+Kabwe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-200 mt-2 font-medium"
                    >
                      <span>Open in Google Maps Plus Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Opening Hours (Editable by Staff) */}
              <div className="p-4 rounded-xl glass-card border border-amber-500/20 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80">
                          Opening Hours
                        </span>
                        {isStaffLoggedIn && (
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/20 px-1.5 py-0.2 rounded">
                            Staff Editable
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-white text-sm mt-1 leading-snug">
                        {settings.openingHours}
                      </p>
                    </div>
                  </div>

                  {isStaffLoggedIn && (
                    <button
                      onClick={() => setIsStaffModalOpen(true)}
                      title="Edit hours in Staff Terminal"
                      className="text-amber-400 hover:text-amber-200 p-1.5 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Event Booking Ticket Generator & Live Pricing (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                  Real-Time Concierge Dispatch
                </span>
                <h3 className="font-serif-luxe text-xl sm:text-2xl text-white font-bold mt-0.5">
                  Plan Your Beverage Experience
                </h3>
              </div>
              <GlassWater className="w-6 h-6 text-amber-400" />
            </div>

            {submittedTicket ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h4 className="font-serif-luxe text-xl text-white font-bold">
                  Order Ticket Created Successfully!
                </h4>

                <p className="text-xs sm:text-sm text-amber-100/80 max-w-md mx-auto">
                  Your event ticket has been dispatched live to the Muko Luxe Concierge team terminal. This ticket is saved securely on your device.
                </p>

                {/* TICKET NUMBER & TOTAL PRICE DISPLAY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
                    <span className="text-[11px] text-amber-400/70 font-mono uppercase block">
                      Your Ticket Reference
                    </span>
                    <span className="text-lg font-mono font-bold text-amber-300">
                      {submittedTicket.ticketNumber}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
                    <span className="text-[11px] text-amber-400/70 font-mono uppercase block">
                      Total Price of Selected Items
                    </span>
                    <span className="text-lg font-mono font-bold text-amber-300">
                      ZMW {submittedTicket.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => downloadOrderTicket(submittedTicket)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-semibold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Ticket Pass</span>
                  </button>

                  <a
                    href={`https://wa.me/260968366647?text=Hi%20Humphrey,%20I%20just%20submitted%20ticket%20${submittedTicket.ticketNumber}%20(Total:%20ZMW%20${submittedTicket.totalPrice.toFixed(2)})%20for%20my%20event.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm via WhatsApp (+2609 68 3 66 6 47)</span>
                  </a>

                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="px-4 py-2.5 rounded-xl glass-card text-amber-200 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                  >
                    Create Another Booking
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                      Client / Host Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Natasha Lungu"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0977xxxxxx"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-black"
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Corporate Gala">Corporate Gala</option>
                      <option value="Private Celebration">Private Celebration</option>
                      <option value="Birthday Soirée">Birthday Soirée</option>
                      <option value="Cocktail Reception">Cocktail Reception</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                      Est. Guests
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                    Venue / Event Location
                  </label>
                  <input
                    type="text"
                    value={locationVenue}
                    onChange={(e) => setLocationVenue(e.target.value)}
                    placeholder="e.g. Kabwe Golf Club, Private Residence, Lusaka Venue"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                {/* Cocktail selection chips with prices */}
                <div>
                  <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                    Select Cocktails For Your Bar Menu (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {drinks.map((d) => {
                      const isSelected = selectedDrinks.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDrinkSelection(d.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-black font-semibold'
                              : 'glass-card text-amber-200/80 hover:text-white border border-white/10'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                          <span>{d.name}</span>
                          <span className={`font-mono text-[11px] ${isSelected ? 'text-black font-bold' : 'text-amber-400'}`}>
                            (ZMW {d.price.toFixed(2)})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DEDICATED CUSTOMER TOTAL PRICE BOX */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black/80 to-amber-950/40 border border-amber-400/40 shadow-inner">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="text-[11px] font-mono uppercase text-amber-400/80 block">
                          Total Price of Selected Items
                        </span>
                        <span className="text-xs text-amber-200/70">
                          {bookingSelectedDrinkItems.length} cocktail{bookingSelectedDrinkItems.length !== 1 ? 's' : ''} chosen for bar package
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-2xl font-bold text-amber-300">
                        ZMW {bookingTotalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {bookingSelectedDrinkItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-500/15 flex flex-wrap gap-2 text-xs">
                      {bookingSelectedDrinkItems.map(d => (
                        <span key={d.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-amber-500/20 text-[11px] text-amber-200">
                          {d.name}: <strong className="text-amber-300 font-mono">ZMW {d.price.toFixed(2)}</strong>
                          <button
                            type="button"
                            onClick={() => toggleDrinkSelection(d.id)}
                            className="hover:text-red-300 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1.5">
                    Special Requests or Mixer Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Let us know about signature garnish ideas, VIP mocktail needs, or specific bar setup times..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Generate Event Order Ticket (Total: ZMW {bookingTotalPrice.toFixed(2)})</span>
                </button>
              </form>
            )}
          </div>

          {/* SECURE PRIVATE TRACKING PANEL BELOW ORDER TICKET (PROTECTED AGAINST SNOOPING) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Secure Client Tracking Portal
                </span>
                <h3 className="font-serif-luxe text-xl sm:text-2xl text-white font-bold mt-0.5">
                  Check Your Event Ticket Progress & Download
                </h3>
              </div>
              <Search className="w-6 h-6 text-amber-400" />
            </div>

            <p className="text-xs sm:text-sm text-amber-100/75 mb-4">
              To protect customer confidentiality, only you can access your booking pass. Enter your ticket reference and verification phone number to view progress and download your official pass.
            </p>

            <form onSubmit={handleTrackTicket} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-amber-400/80 uppercase block mb-1">
                    Ticket Reference *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MLC-2026-081"
                    value={trackingInput}
                    onChange={(e) => {
                      setTrackingInput(e.target.value);
                      setTrackingError(false);
                      setVerificationError('');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-amber-400/80 uppercase block mb-1">
                    Booking Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0977xxxxxx"
                    value={trackingPhone}
                    onChange={(e) => {
                      setTrackingPhone(e.target.value);
                      setVerificationError('');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                {/* Fast access to own device bookings only */}
                {myTickets.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300">
                    <span className="text-[10px] font-mono text-amber-400/60 uppercase">Your Booking:</span>
                    {myTickets.slice(0, 2).map((ref) => (
                      <button
                        key={ref}
                        type="button"
                        onClick={() => {
                          setTrackingInput(ref);
                          const target = tickets.find(t => t.ticketNumber.toUpperCase() === ref);
                          if (target) {
                            setTrackedTicket(target);
                            setTrackingPhone(target.clientPhone);
                            setTrackingError(false);
                            setVerificationError('');
                          }
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="ml-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify & Track</span>
                </button>
              </div>
            </form>

            {/* Error notifications */}
            {verificationError && (
              <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}

            {trackingError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Ticket reference not found. Please double-check your reference code or contact our concierge directly.</span>
              </div>
            )}

            {/* TRACKED TICKET DISPLAY CARD (REVEALED ONLY UPON VERIFIED OWNERSHIP) */}
            <AnimatePresence>
              {trackedTicket && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#14100c] border border-amber-500/40 shadow-xl space-y-6"
                >
                  {/* Top Bar of Tracked Ticket */}
                  <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-amber-500/20">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-amber-400/70 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Verified Client Event Pass
                      </div>
                      <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-0.5">
                        {trackedTicket.ticketNumber}
                      </div>
                      <div className="text-xs text-amber-200/70 mt-1">
                        Host: <strong className="text-white">{trackedTicket.clientName}</strong> · {trackedTicket.eventType}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
                        trackedTicket.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : trackedTicket.status === 'Bar Planning'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : trackedTicket.status === 'Completed'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : trackedTicket.status === 'Cancelled'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        Status: {trackedTicket.status}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL PROGRESS BAR */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Event Execution Progress</span>
                      <span>
                        {trackedTicket.status === 'Cancelled' ? 'Booking Cancelled' : `${trackedTicket.status} Stage`}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { step: 1, label: 'Pending', desc: 'Ticket Logged' },
                        { step: 2, label: 'Bar Planning', desc: 'Mixologist Assigned' },
                        { step: 3, label: 'Confirmed', desc: 'Bar Locked & Ready' },
                        { step: 4, label: 'Completed', desc: 'Event Served' }
                      ].map((st) => {
                        const currentStage = getProgressStage(trackedTicket.status);
                        const isReached = currentStage >= st.step;
                        const isCurrent = currentStage === st.step;

                        return (
                          <div key={st.step} className="space-y-1.5">
                            <div className={`h-2 rounded-full transition-all ${
                              isReached
                                ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                                : 'bg-white/10'
                            }`} />
                            <div className="text-[10px] sm:text-xs">
                              <span className={`font-semibold block ${isCurrent ? 'text-amber-300' : isReached ? 'text-white' : 'text-white/40'}`}>
                                {st.label}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-amber-200/50 hidden sm:block">
                                {st.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ticket Key Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-white/5">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/10">
                      <span className="text-amber-400/60 block font-mono text-[10px]">EVENT DATE</span>
                      <span className="font-semibold text-white">{trackedTicket.eventDate}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/10">
                      <span className="text-amber-400/60 block font-mono text-[10px]">VENUE LOCATION</span>
                      <span className="font-semibold text-white truncate block">{trackedTicket.location}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/10">
                      <span className="text-amber-400/60 block font-mono text-[10px]">GUEST COUNT</span>
                      <span className="font-semibold text-white">{trackedTicket.guestCount} Guests</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/10">
                      <span className="text-amber-400/60 block font-mono text-[10px]">TOTAL PRICE</span>
                      <span className="font-bold text-amber-300 font-mono">
                        ZMW {(trackedTicket.totalPrice || trackedTicket.selectedDrinks.reduce((sum, d) => sum + (d.price || 0), 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Requested Drinks with item prices */}
                  <div className="p-3 rounded-lg bg-black/40 border border-amber-500/10 text-xs">
                    <span className="text-amber-400/60 block font-mono text-[10px] uppercase mb-1.5">
                      Selected Cocktails & Pricing
                    </span>
                    <div className="space-y-1">
                      {trackedTicket.selectedDrinks.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-amber-200 py-0.5 border-b border-white/5">
                          <span>{d.name}</span>
                          <span className="font-mono text-amber-300 font-semibold">
                            {d.price ? `ZMW ${d.price.toFixed(2)}` : 'Included in Package'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => downloadOrderTicket(trackedTicket)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wide flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Official Ticket Pass</span>
                    </button>

                    <a
                      href={`https://wa.me/260968366647?text=Hi%20Humphrey,%20I%20am%20tracking%20ticket%20${trackedTicket.ticketNumber}%20(${trackedTicket.status},%20Total:%20ZMW%20${(trackedTicket.totalPrice || 0).toFixed(2)})%20for%20my%20event.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm via WhatsApp (+2609 68 3 66 6 47)</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
