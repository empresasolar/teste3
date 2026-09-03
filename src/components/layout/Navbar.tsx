import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RcSolarLogo } from '../ui/RcSolarLogo';
import {
  Sun,
  Moon,
  Phone,
  MessageCircle,
  Instagram,
  Menu,
  X,
  Calculator,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { siteData, isDarkMode, setIsDarkMode } = useApp();
  const { general } = siteData;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Calculadora Solar', href: '#calculadora', highlight: true },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Projetos Realizados', href: '#projetos' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas (FAQ)', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(general.whatsappMessage);
    window.open(`https://wa.me/${general.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Bar - Commercial Contacts */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={`tel:${general.phone.replace(/\D/g, '')}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">{general.phone}</span>
            </a>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp Direto</span>
            </button>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {general.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {general.instagramUrl && general.instagramUrl.trim() !== '' && general.instagramUrl !== '#' && (
              <a
                href={general.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-300 hover:text-pink-400 transition-colors"
                title="Instagram Oficial"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden lg:inline">
                  {general.instagramUrl.includes('instagram.com/')
                    ? `@${general.instagramUrl.split('instagram.com/')[1]?.split(/[/?#]/)[0] || 'Instagram'}`
                    : 'Instagram'}
                </span>
              </a>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 px-4 sm:px-8 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80 dark:border-slate-800/80'
            : 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-sm py-4 border-b border-slate-200/50 dark:border-slate-900/50'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo RC Engenharia Solar */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inicio');
            }}
            className="flex items-center group cursor-pointer"
            title="RC Engenharia Solar - Página Inicial"
          >
            <RcSolarLogo variant="full" size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  link.highlight
                    ? 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('#calculadora')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Simular Economia</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                  link.highlight
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2.5">
              <button
                onClick={() => handleNavClick('#calculadora')}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Simular Economia Solar</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
