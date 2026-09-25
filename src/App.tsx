import React from 'react';
import { AppProvider } from './context/AppContext';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { IntroHero } from './components/IntroHero';
import { InteractiveMenu } from './components/InteractiveMenu';
import { Gallery } from './components/Gallery';
import { BookingLocation } from './components/BookingLocation';
import { Footer } from './components/Footer';
import { AboutModal } from './components/AboutModal';
import { CustomerFeedbackModal } from './components/CustomerFeedbackModal';
import { StaffTerminalModal } from './components/StaffTerminalModal';
import { NotificationBanner } from './components/NotificationBanner';

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#080706] text-[#f7f3ed] selection:bg-amber-500 selection:text-black flex flex-col font-sans">
      {/* Real-Time Booking & Purchase Pop Notifications */}
      <NotificationBanner />

      {/* Dedicated Promotion Banner Space (Live Editable) */}
      <PromoBanner />

      {/* Header & Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Intro Section */}
        <IntroHero />

        {/* 2. Interactive Menu */}
        <InteractiveMenu />

        {/* 3. Image Gallery (Cocktails Only) */}
        <Gallery />

        {/* 4. Booking & Location (Fourth Position) */}
        <BookingLocation />
      </main>

      {/* Footer */}
      <Footer />

      {/* Dynamic Slide/Modal Overlays */}
      {/* 1. About Us (Dynamic Toggle with exact copy & selected reviews) */}
      <AboutModal />

      {/* 2. Customer Feedback System (1-5 Star Ratings & Event Reviews) */}
      <CustomerFeedbackModal />

      {/* 3. Secure Staff Terminal */}
      <StaffTerminalModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
