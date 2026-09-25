import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';

export const CustomerFeedbackModal: React.FC = () => {
  const {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    feedbackTargetTicket,
    setFeedbackTargetTicket,
    submitTicketFeedback
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (feedbackTargetTicket) {
      setClientName(feedbackTargetTicket.clientName);
      setEventType(feedbackTargetTicket.eventType);
    } else {
      setClientName('');
      setReviewText('');
    }
    setIsSubmitted(false);
  }, [feedbackTargetTicket, isFeedbackModalOpen]);

  if (!isFeedbackModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !reviewText.trim()) return;

    submitTicketFeedback(
      feedbackTargetTicket ? feedbackTargetTicket.id : null,
      clientName.trim(),
      eventType,
      rating,
      reviewText.trim()
    );

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsFeedbackModalOpen(false);
    setFeedbackTargetTicket(null);
    setIsSubmitted(false);
    setReviewText('');
  };

  const ratingDescriptions: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Service',
    4: 'Great & Very Professional',
    5: 'Exceptional Luxury Experience'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative z-10 w-full max-w-lg glass-panel rounded-3xl border border-amber-500/35 p-6 sm:p-8 shadow-2xl overflow-hidden my-auto"
        >
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                Customer Feedback System
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-white hover:bg-amber-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300 shadow-xl">
                <HeartHandshake className="w-8 h-8" />
              </div>

              <h3 className="font-serif-luxe text-2xl text-white font-bold">
                Thank You for Your Feedback!
              </h3>

              <p className="text-sm text-amber-100/80 leading-relaxed max-w-sm mx-auto font-editorial italic">
                &ldquo;Your review helps us refine every pour, garnish, and bar service. Positive reviews are celebrated and showcased on our website.&rdquo;
              </p>

              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all"
                >
                  Return to Muko Luxe
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <h3 className="font-serif-luxe text-xl text-white font-bold">
                  Rate Your Event Experience
                </h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  How was the mobile bar presentation, cocktail craftsmanship, and service throughout your event?
                </p>
                {feedbackTargetTicket && (
                  <div className="mt-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
                    Completed Ticket Ref: {feedbackTargetTicket.ticketNumber}
                  </div>
                )}
              </div>

              {/* Star Rating Selector */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-2">
                  Select Star Rating (1 - 5)
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeVal = hoverRating || rating;
                    const isFilled = star <= activeVal;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                              : 'text-amber-400/20'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-mono text-amber-300 mt-2 font-medium">
                  {rating} / 5 · {ratingDescriptions[hoverRating || rating]}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
                    Your Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Mwamba & Thandiwe Banda"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
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
                    <option value="Anniversary Party">Anniversary Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-amber-300/80 mb-1">
                    Your Written Review & Comments *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe how the bar looked, guest reactions to the Signature Blend, bartenders' attentiveness..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Event Review</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
