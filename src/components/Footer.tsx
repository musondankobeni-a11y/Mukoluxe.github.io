import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsStaffModalOpen, isStaffLoggedIn, toggleAbout, setIsFeedbackModalOpen } = useApp();

  return (
    <footer className="relative z-20 border-t border-amber-500/20 bg-[#060504] px-4 sm:px-8 py-12 text-amber-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-amber-500/15">
          {/* Col 1: Bottom Left Branding -> "muko_luxe" */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-amber-500/40 bg-amber-500/20 flex items-center justify-center">
                <span className="font-serif-luxe text-amber-300 text-xs font-bold">M</span>
              </div>
              {/* Bottom Left Corner exact text: muko_luxe */}
              <span className="font-serif-luxe text-lg text-white font-bold tracking-wider">
                muko_luxe
              </span>
            </div>
            <p className="text-xs text-amber-300/60 leading-relaxed font-editorial italic">
              Elevating celebrations with artisanal cocktail curation and premier mobile bartending concierge.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase block mb-3">
              Concierge Navigation
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#intro-section" className="hover:text-amber-300 transition-colors">
                  01. Intro & Experience
                </a>
              </li>
              <li>
                <button onClick={toggleAbout} className="hover:text-amber-300 transition-colors text-left">
                  02. About Us & Services (Toggle)
                </button>
              </li>
              <li>
                <a href="#menu-section" className="hover:text-amber-300 transition-colors">
                  03. Interactive Menu & Signature Blend
                </a>
              </li>
              <li>
                <a href="#gallery-section" className="hover:text-amber-300 transition-colors">
                  04. Artisanal Cocktail Gallery
                </a>
              </li>
              <li>
                <a href="#booking-section" className="hover:text-amber-300 transition-colors">
                  05. Booking & Location
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Lines & Location */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase block mb-3">
              Contact & Coordinates
            </span>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call: {settings.contactPhone}</span>
              </a>

              <a
                href="https://wa.me/260968366647"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: +2609 68 3 66 6 47</span>
              </a>

              <div className="flex items-center gap-2 text-amber-200/70">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Location: {settings.locationCode}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Feedback & Staff Access */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase block mb-3">
              Client & Staff Portals
            </span>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="w-full py-2 px-3 rounded-lg glass-card border border-amber-500/20 text-xs text-amber-200 hover:text-white hover:border-amber-400/40 flex items-center justify-center gap-2 transition-all"
            >
              <span>Leave Event Feedback</span>
            </button>

            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isStaffLoggedIn ? 'Staff Dashboard Active' : 'Staff Login Terminal'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar with Mandatory Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Bottom Left Branding: muko_luxe */}
          <div className="font-serif-luxe text-amber-400 tracking-wider">
            muko_luxe
          </div>

          {/* Footer Credits: Exactly "©muko luxe_concierge design by Humphrey nkobeni.." */}
          <div className="font-mono text-amber-200/90 text-center sm:text-right tracking-wide">
            ©muko luxe_concierge design by Humphrey nkobeni..
          </div>
        </div>
      </div>
    </footer>
  );
};
