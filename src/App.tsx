import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { CalculatorSection } from './components/sections/CalculatorSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { BenefitsSection } from './components/sections/BenefitsSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FaqSection } from './components/sections/FaqSection';
import { ContactSection } from './components/sections/ContactSection';
import { DetailModals } from './components/ui/DetailModals';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { ToastContainer } from './components/ui/Toast';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Content Flow */}
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <CalculatorSection />
        <PortfolioSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Utilities & Modals */}
      <FloatingWhatsApp />
      <DetailModals />
      <AdminLoginModal />
      <AdminDashboard />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
