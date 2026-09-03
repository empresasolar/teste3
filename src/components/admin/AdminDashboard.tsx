import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GeneralSettingsTab } from './tabs/GeneralSettingsTab';
import { HeroSettingsTab } from './tabs/HeroSettingsTab';
import { AboutSettingsTab } from './tabs/AboutSettingsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { PortfolioTab } from './tabs/PortfolioTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { FaqTab } from './tabs/FaqTab';
import { CalculatorSettingsTab } from './tabs/CalculatorSettingsTab';
import { LeadsTab } from './tabs/LeadsTab';
import { ThemeTab } from './tabs/ThemeTab';
import { DatabaseTab } from './tabs/DatabaseTab';
import {
  Settings,
  Layout,
  Info,
  Briefcase,
  Layers,
  MessageSquare,
  HelpCircle,
  Calculator,
  Users,
  Palette,
  Database,
  LogOut,
  X,
  ExternalLink,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab =
  | 'general'
  | 'hero'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'faq'
  | 'calculator'
  | 'leads'
  | 'theme'
  | 'database';

interface NavItemConfig {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  count?: number;
  isConnected?: boolean;
}

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    logoutAdmin,
    leads,
    siteData,
    isSupabaseConnected,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('leads');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAdminDashboardOpen) return null;

  const newLeadsCount = leads.filter((l) => l.status === 'Novo').length;

  const navItems: NavItemConfig[] = [
    { id: 'leads', label: 'CRM Leads', icon: Users, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
    { id: 'general', label: 'Identidade & Contatos', icon: Settings },
    { id: 'hero', label: 'Banner & Textos', icon: Layout },
    { id: 'about', label: 'Sobre & Engenharia', icon: Info },
    { id: 'services', label: 'Serviços Solares', icon: Briefcase, count: siteData.services.length },
    { id: 'portfolio', label: 'Portfólio / Obras', icon: Layers, count: siteData.portfolio.length },
    { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare, count: siteData.testimonials.length },
    { id: 'faq', label: 'Perguntas (FAQ)', icon: HelpCircle, count: siteData.faqs.length },
    { id: 'calculator', label: 'Calculadora Solar', icon: Calculator },
    { id: 'theme', label: 'Sistema de Temas', icon: Palette },
    { id: 'database', label: 'Banco Supabase', icon: Database, isConnected: isSupabaseConnected },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettingsTab />;
      case 'hero':
        return <HeroSettingsTab />;
      case 'about':
        return <AboutSettingsTab />;
      case 'services':
        return <ServicesTab />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'faq':
        return <FaqTab />;
      case 'calculator':
        return <CalculatorSettingsTab />;
      case 'leads':
        return <LeadsTab />;
      case 'theme':
        return <ThemeTab />;
      case 'database':
        return <DatabaseTab />;
      default:
        return <LeadsTab />;
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex bg-slate-950/80 backdrop-blur-md overflow-hidden">
      {/* Main Admin Wrapper */}
      <div className="w-full h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                RC
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Painel de Controle • {siteData.general.companyName}
                </h1>
                <div className="text-[10px] text-slate-400">
                  Gerenciador Total de Conteúdo & Engenharia
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View live site */}
            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site em Tempo Real</span>
            </button>

            {/* Logout */}
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>

            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (Desktop) */}
          <aside className="w-64 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-4 space-y-1 overflow-y-auto hidden lg:block shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[11px] opacity-70">
                      {item.count}
                    </span>
                  )}
                  {item.isConnected !== undefined && (
                    <span className={`w-2 h-2 rounded-full ${item.isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  )}
                </button>
              );
            })}
          </aside>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 top-16 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  className="fixed inset-y-16 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-1 z-50 overflow-y-auto lg:hidden shadow-2xl"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Tab Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white dark:bg-slate-950">
            <div className="max-w-5xl mx-auto">
              {renderActiveTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
