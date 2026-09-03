import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FullSiteData,
  SiteGeneralConfig,
  HeroConfig,
  AboutConfig,
  SolarCalculatorConfig,
  ServiceItem,
  PortfolioItem,
  TestimonialItem,
  FaqItem,
  BenefitItem,
  LeadItem,
  ThemeConfig,
  SupabaseConfig,
} from '../types';
import { initialSiteData, sampleLeads } from '../data/initialData';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient,
  testSupabaseConnection as testSupabaseConnectionApi,
} from '../lib/supabaseClient';
import {
  pushToCloudSync,
  fetchFromCloudSync,
  getLastCloudTimestamp,
  setLastCloudTimestamp,
} from '../lib/cloudSync';
import { applyThemeToDocument } from '../lib/themeEngine';
import { verifyAdminPassword, updateAdminPasswordInDatabase } from '../lib/authSecurity';

const STORAGE_SITE_DATA_KEY = 'rc_solar_site_data_v2';
const STORAGE_LEADS_KEY = 'rc_solar_leads_v2';
const STORAGE_THEME_KEY = 'rc_solar_theme_mode_v2';
const ADMIN_AUTH_KEY = 'rc_solar_admin_auth_v2';

function sanitizeSiteData(data: any): FullSiteData {
  if (!data || typeof data !== 'object') return initialSiteData;

  const result: FullSiteData = {
    ...initialSiteData,
    ...data,
    general: {
      ...initialSiteData.general,
      ...(data.general || {}),
    },
    hero: {
      ...initialSiteData.hero,
      ...(data.hero || {}),
    },
    about: {
      ...initialSiteData.about,
      ...(data.about || {}),
    },
    calculator: {
      ...initialSiteData.calculator,
      ...(data.calculator || {}),
    },
    services: Array.isArray(data.services) && data.services.length > 0 ? data.services : initialSiteData.services,
    portfolio: Array.isArray(data.portfolio) && data.portfolio.length > 0 ? data.portfolio : initialSiteData.portfolio,
    testimonials: Array.isArray(data.testimonials) && data.testimonials.length > 0 ? data.testimonials : initialSiteData.testimonials,
    faqs: Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : initialSiteData.faqs,
    benefits: Array.isArray(data.benefits) && data.benefits.length > 0 ? data.benefits : initialSiteData.benefits,
    currentTheme: data.currentTheme || initialSiteData.currentTheme,
    customThemes: Array.isArray(data.customThemes) ? data.customThemes : initialSiteData.customThemes,
  };

  // Enforce company name and identity: if legacy name detected, restore RC Engenharia Solar
  const genStr = JSON.stringify(result.general).toLowerCase();
  if (
    genStr.includes('globo') ||
    !result.general.companyName ||
    !result.general.companyName.toLowerCase().includes('rc')
  ) {
    result.general = { ...initialSiteData.general };
  }

  return result;
}

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  siteData: FullSiteData;
  leads: LeadItem[];
  supabaseConfig: SupabaseConfig;
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  isAdminOpen: boolean;
  isAdminLoginModalOpen: boolean;
  isAdminDashboardOpen: boolean;
  isAdminAuthenticated: boolean;
  activeAdminTab: string;
  isLoading: boolean;
  isDarkMode: boolean;
  toasts: ToastState[];
  selectedServiceForModal: ServiceItem | null;
  selectedProjectForModal: PortfolioItem | null;
  currentTheme: ThemeConfig;
  
  // Navigation & Admin Modal Actions
  openAdmin: () => void;
  closeAdmin: () => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  setIsAdminDashboardOpen: (open: boolean) => void;
  setActiveAdminTab: (tab: string) => void;
  loginAdmin: (password: string) => Promise<boolean>;
  changeAdminPassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  setIsDarkMode: (dark: boolean) => void;
  
  // Feedback
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setSelectedServiceForModal: (service: ServiceItem | null) => void;
  setSelectedProjectForModal: (project: PortfolioItem | null) => void;
  
  // Content Update Actions
  updateGeneralConfig: (data: Partial<SiteGeneralConfig>) => void;
  updateHeroConfig: (data: Partial<HeroConfig>) => void;
  updateAboutConfig: (data: Partial<AboutConfig>) => void;
  updateCalculatorConfig: (data: Partial<SolarCalculatorConfig>) => void;
  setServices: (services: ServiceItem[]) => void;
  setPortfolio: (portfolio: PortfolioItem[]) => void;
  setTestimonials: (testimonials: TestimonialItem[]) => void;
  setFaqs: (faqs: FaqItem[]) => void;
  setBenefits: (benefits: BenefitItem[]) => void;
  setTheme: (theme: ThemeConfig) => void;
  saveCustomTheme: (theme: ThemeConfig) => void;
  resetToDefaultData: () => void;

  // Leads Actions
  addLead: (lead: Omit<LeadItem, 'id' | 'createdAt'>) => Promise<boolean>;
  updateLeadStatus: (id: string, status: LeadItem['status']) => void;
  deleteLead: (id: string) => void;

  // Deletion Actions (Instant Cloud & Supabase Delete)
  deleteTestimonial: (id: string) => Promise<void> | void;
  deleteService: (id: string) => Promise<void> | void;
  deletePortfolioItem: (id: string) => Promise<void> | void;
  deleteFaq: (id: string) => Promise<void> | void;
  deleteBenefit: (id: string) => Promise<void> | void;

  // Supabase Actions
  setSupabaseConfig: (config: SupabaseConfig | Partial<SupabaseConfig>) => void;
  testSupabaseConnection: () => Promise<boolean>;
  syncToSupabase: () => Promise<void>;
  fetchFromSupabase: () => Promise<void>;
  saveAndTestSupabase: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
  syncWithSupabase: () => Promise<void>;
  pushLocalToSupabase: () => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or defaults
  const [siteData, setSiteData] = useState<FullSiteData>(() => {
    try {
      if (typeof window !== 'undefined') {
        const legacyKeys = [
          'globo_solar_site_data_v1',
          'globo_solar_site_data',
          'globo_solar_cloud_sync_meta',
          'globo_solar_blob_id',
          'globo_solar_leads_v1',
          'globo_solar_leads_data',
        ];
        legacyKeys.forEach((k) => {
          try {
            const val = localStorage.getItem(k);
            if (val && /globo/i.test(val)) {
              localStorage.removeItem(k);
            }
          } catch {}
        });
      }

      const saved = localStorage.getItem(STORAGE_SITE_DATA_KEY);
      if (saved) {
        return sanitizeSiteData(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error parsing saved site data:', e);
    }
    return initialSiteData;
  });

  const [leads, setLeads] = useState<LeadItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing saved leads:', e);
    }
    return sampleLeads;
  });

  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(getSavedSupabaseConfig);
  const [isSyncing, setIsSyncing] = useState(false);

  // Admin Modal and Dashboard states
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [activeAdminTab, setActiveAdminTab] = useState('leads');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<PortfolioItem | null>(null);
  
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved) return saved === 'dark';
    } catch {}
    return true;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem(STORAGE_THEME_KEY, isDarkMode ? 'dark' : 'light');
      } catch {}
    }
  }, [isDarkMode]);

  const setIsDarkMode = useCallback((dark: boolean) => {
    setIsDarkModeState(dark);
  }, []);

  // Apply active theme to the DOM
  useEffect(() => {
    if (siteData?.currentTheme) {
      applyThemeToDocument(siteData.currentTheme);
    }
  }, [siteData?.currentTheme]);

  // Persist siteData locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SITE_DATA_KEY, JSON.stringify(siteData));
    } catch (e) {
      console.error('Error saving siteData to localStorage:', e);
    }
  }, [siteData]);

  // Persist leads locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Error saving leads to localStorage:', e);
    }
  }, [leads]);

  // Toast Helpers
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Open Admin Action (handles auth verification)
  const openAdmin = useCallback(() => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
      setIsAdminLoginModalOpen(false);
    } else {
      setIsAdminLoginModalOpen(true);
      setIsAdminDashboardOpen(false);
    }
  }, [isAdminAuthenticated]);

  const closeAdmin = useCallback(() => {
    setIsAdminLoginModalOpen(false);
    setIsAdminDashboardOpen(false);
  }, []);

  const setIsAdminOpen = useCallback((open: boolean) => {
    if (open) {
      openAdmin();
    } else {
      closeAdmin();
    }
  }, [openAdmin, closeAdmin]);

  // Admin Auth Helpers
  const loginAdmin = useCallback(async (password: string): Promise<boolean> => {
    const isValid = await verifyAdminPassword(password);

    if (isValid) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {}
      setIsAdminLoginModalOpen(false);
      setIsAdminDashboardOpen(true);
      showToast('Acesso administrativo autorizado com sucesso!', 'success');
      return true;
    } else {
      showToast('Senha administrativa incorreta.', 'error');
      return false;
    }
  }, [showToast]);

  const changeAdminPassword = useCallback(async (newPassword: string) => {
    const result = await updateAdminPasswordInDatabase(newPassword);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  }, [showToast]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {}
    setIsAdminDashboardOpen(false);
    setIsAdminLoginModalOpen(false);
    showToast('Sessão administrativa encerrada.', 'info');
  }, [showToast]);

  // Supabase Config setter
  const setSupabaseConfig = useCallback((config: SupabaseConfig | Partial<SupabaseConfig>) => {
    setSupabaseConfigState((prev) => {
      const updated = { ...prev, ...config };
      saveSupabaseConfig(updated);
      return updated;
    });
  }, []);

  // Test Supabase Connection
  const testSupabaseConnection = useCallback(async (): Promise<boolean> => {
    const current = getSavedSupabaseConfig();
    if (!current.url || !current.anonKey) {
      showToast('Insira a URL e Anon Key do Supabase.', 'error');
      return false;
    }
    const res = await testSupabaseConnectionApi(current.url, current.anonKey);
    const updated: SupabaseConfig = {
      ...current,
      isConnected: res.success,
      lastChecked: new Date().toISOString(),
      errorMessage: res.success ? undefined : res.message,
    };
    setSupabaseConfigState(updated);
    saveSupabaseConfig(updated);
    if (res.success) {
      showToast('Conexão com Supabase validada com sucesso!', 'success');
    } else {
      showToast(res.message || 'Falha ao conectar com o Supabase.', 'error');
    }
    return res.success;
  }, [showToast]);

  // Auto push to Supabase & Universal Cloud Sync in background
  const autoPushToSupabase = useCallback(async (dataToSync: FullSiteData) => {
    // 1. Instant Cloud Sync (Zero-SQL, Works across all devices & Vercel)
    pushToCloudSync(dataToSync, leads).catch((e) => console.warn('Cloud sync error:', e));

    // 2. Direct Supabase if configured & tables exist
    const client = getSupabaseClient();
    if (!client) return;

    try {
      // 1. Settings
      await client.from('site_settings').upsert({
        id: 'main_settings',
        general: dataToSync.general,
        hero: dataToSync.hero,
        about: dataToSync.about,
        calculator: dataToSync.calculator,
        current_theme: dataToSync.currentTheme,
        custom_themes: dataToSync.customThemes || [],
        updated_at: new Date().toISOString(),
      });

      // 2. Services Upsert & Reconciliation
      if (dataToSync.services?.length) {
        for (const s of dataToSync.services) {
          await client.from('services').upsert({
            id: s.id,
            title: s.title,
            short_description: s.shortDescription,
            full_description: s.fullDescription,
            icon_name: s.iconName,
            image_url: s.imageUrl,
            features: s.features || [],
            active: s.active,
            display_order: s.order,
            updated_at: new Date().toISOString(),
          });
        }
      }
      try {
        const { data: dbServices } = await client.from('services').select('id');
        if (dbServices && dbServices.length > 0) {
          const currentIds = new Set((dataToSync.services || []).map((s) => s.id));
          const toDel = dbServices.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          for (const dId of toDel) {
            await client.from('services').delete().eq('id', dId);
          }
        }
      } catch {}

      // 3. Portfolio Upsert & Reconciliation
      if (dataToSync.portfolio?.length) {
        for (const p of dataToSync.portfolio) {
          await client.from('portfolio_projects').upsert({
            id: p.id,
            title: p.title,
            category: p.category,
            power_kwp: p.powerKwp,
            monthly_economy_rs: p.monthlyEconomyRs,
            location: p.location,
            image_url: p.imageUrl,
            description: p.description,
            modules_count: p.modulesCount,
            featured: p.featured,
            active: p.active,
            display_order: p.order,
            updated_at: new Date().toISOString(),
          });
        }
      }
      try {
        const { data: dbPort } = await client.from('portfolio_projects').select('id');
        if (dbPort && dbPort.length > 0) {
          const currentIds = new Set((dataToSync.portfolio || []).map((p) => p.id));
          const toDel = dbPort.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          for (const dId of toDel) {
            await client.from('portfolio_projects').delete().eq('id', dId);
          }
        }
      } catch {}

      // 4. Testimonials (Depoimentos / Comentários) Upsert & Reconciliation
      if (dataToSync.testimonials?.length) {
        for (const t of dataToSync.testimonials) {
          await client.from('testimonials').upsert({
            id: t.id,
            client_name: t.clientName,
            role_or_type: t.roleOrType,
            city: t.city,
            rating: t.rating,
            comment: t.comment,
            avatar_url: t.avatarUrl,
            power_kwp: t.powerKwp || null,
            active: t.active,
            display_order: t.order,
            updated_at: new Date().toISOString(),
          });
        }
      }
      try {
        const { data: dbTest } = await client.from('testimonials').select('id');
        if (dbTest && dbTest.length > 0) {
          const currentIds = new Set((dataToSync.testimonials || []).map((t) => t.id));
          const toDel = dbTest.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          for (const dId of toDel) {
            await client.from('testimonials').delete().eq('id', dId);
          }
        }
      } catch {}

      // 5. FAQs Upsert & Reconciliation
      if (dataToSync.faqs?.length) {
        for (const f of dataToSync.faqs) {
          await client.from('faqs').upsert({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category,
            active: f.active,
            display_order: f.order,
            updated_at: new Date().toISOString(),
          });
        }
      }
      try {
        const { data: dbFaqs } = await client.from('faqs').select('id');
        if (dbFaqs && dbFaqs.length > 0) {
          const currentIds = new Set((dataToSync.faqs || []).map((f) => f.id));
          const toDel = dbFaqs.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          for (const dId of toDel) {
            await client.from('faqs').delete().eq('id', dId);
          }
        }
      } catch {}

      // 6. Benefits Upsert & Reconciliation
      if (dataToSync.benefits?.length) {
        for (const b of dataToSync.benefits) {
          await client.from('benefits').upsert({
            id: b.id,
            title: b.title,
            description: b.description,
            icon_name: b.iconName,
            active: b.active,
            display_order: b.order,
            updated_at: new Date().toISOString(),
          });
        }
      }
      try {
        const { data: dbBen } = await client.from('benefits').select('id');
        if (dbBen && dbBen.length > 0) {
          const currentIds = new Set((dataToSync.benefits || []).map((b) => b.id));
          const toDel = dbBen.filter((r: any) => !currentIds.has(r.id)).map((r: any) => r.id);
          for (const dId of toDel) {
            await client.from('benefits').delete().eq('id', dId);
          }
        }
      } catch {}
    } catch (err) {
      console.warn('Auto sync to Supabase notice:', err);
    }
  }, [leads]);

  // Push Local to Supabase
  const pushLocalToSupabase = useCallback(async (customData?: FullSiteData): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase não configurado ou desconectado.' };
    }

    const dataToSync = customData || siteData;

    try {
      setIsSyncing(true);
      // 1. Save Settings
      const { error: settingsError } = await client.from('site_settings').upsert({
        id: 'main_settings',
        general: dataToSync.general,
        hero: dataToSync.hero,
        about: dataToSync.about,
        calculator: dataToSync.calculator,
        current_theme: dataToSync.currentTheme,
        custom_themes: dataToSync.customThemes || [],
        updated_at: new Date().toISOString(),
      });

      if (settingsError && settingsError.code !== '42P01') {
        throw settingsError;
      }

      // 2. Save Services
      if (dataToSync.services?.length) {
        for (const s of dataToSync.services) {
          await client.from('services').upsert({
            id: s.id,
            title: s.title,
            short_description: s.shortDescription,
            full_description: s.fullDescription,
            icon_name: s.iconName,
            image_url: s.imageUrl,
            features: s.features,
            active: s.active,
            display_order: s.order,
            updated_at: new Date().toISOString(),
          });
        }
      }

      // 3. Save Portfolio
      if (dataToSync.portfolio?.length) {
        for (const p of dataToSync.portfolio) {
          await client.from('portfolio_projects').upsert({
            id: p.id,
            title: p.title,
            category: p.category,
            power_kwp: p.powerKwp,
            monthly_economy_rs: p.monthlyEconomyRs,
            location: p.location,
            image_url: p.imageUrl,
            description: p.description,
            modules_count: p.modulesCount,
            featured: p.featured,
            active: p.active,
            display_order: p.order,
            updated_at: new Date().toISOString(),
          });
        }
      }

      // 4. Save Testimonials
      if (dataToSync.testimonials?.length) {
        for (const t of dataToSync.testimonials) {
          await client.from('testimonials').upsert({
            id: t.id,
            client_name: t.clientName,
            role_or_type: t.roleOrType,
            city: t.city,
            rating: t.rating,
            comment: t.comment,
            avatar_url: t.avatarUrl,
            power_kwp: t.powerKwp || null,
            active: t.active,
            display_order: t.order,
            updated_at: new Date().toISOString(),
          });
        }
      }

      // 5. Save FAQs
      if (dataToSync.faqs?.length) {
        for (const f of dataToSync.faqs) {
          await client.from('faqs').upsert({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category,
            active: f.active,
            display_order: f.order,
            updated_at: new Date().toISOString(),
          });
        }
      }

      // 6. Save Benefits
      if (dataToSync.benefits?.length) {
        for (const b of dataToSync.benefits) {
          await client.from('benefits').upsert({
            id: b.id,
            title: b.title,
            description: b.description,
            icon_name: b.iconName,
            active: b.active,
            display_order: b.order,
            updated_at: new Date().toISOString(),
          });
        }
      }

      showToast('Todos os dados foram sincronizados com o Supabase com sucesso!', 'success');
      return { success: true, message: 'Todos os registros foram persistidos no Supabase com sucesso!' };
    } catch (err: any) {
      console.error('Error pushing data to Supabase:', err);
      showToast(`Erro ao sincronizar com Supabase: ${err.message}`, 'error');
      return { success: false, message: err.message };
    } finally {
      setIsSyncing(false);
    }
  }, [siteData, showToast]);

  const syncToSupabase = useCallback(async () => {
    await pushLocalToSupabase();
  }, [pushLocalToSupabase]);

  // Sync / Pull from Supabase
  const syncWithSupabase = useCallback(async (silent = false) => {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      if (!silent) setIsSyncing(true);

      // 1. Settings
      const { data: settingsRow, error: settingsErr } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'main_settings')
        .maybeSingle();

      if (!settingsErr && settingsRow) {
        let cleanGeneral = settingsRow.general || initialSiteData.general;
        const genJson = JSON.stringify(cleanGeneral).toLowerCase();
        if (
          genJson.includes('globo') ||
          !cleanGeneral.companyName ||
          !cleanGeneral.companyName.toLowerCase().includes('rc')
        ) {
          console.warn('Remnants of legacy company settings detected in remote Supabase, auto-updating to RC Engenharia Solar...');
          cleanGeneral = { ...initialSiteData.general };
          // Self-heal remote table
          Promise.resolve(
            client
              .from('site_settings')
              .upsert({
                id: 'main_settings',
                general: cleanGeneral,
                updated_at: new Date().toISOString(),
              })
          ).catch((e) => console.warn('Could not auto-heal remote site_settings:', e));
        }

        setSiteData((prev) => ({
          ...prev,
          general: cleanGeneral,
          hero: settingsRow.hero || prev.hero,
          about: settingsRow.about || prev.about,
          calculator: settingsRow.calculator || prev.calculator,
          currentTheme: settingsRow.current_theme || prev.currentTheme,
          customThemes: settingsRow.custom_themes || prev.customThemes,
        }));
      }

      // 2. Fetch Services
      const { data: servicesData, error: sErr } = await client
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!sErr && servicesData && servicesData.length > 0) {
        setSiteData((prev) => ({
          ...prev,
          services: servicesData.map((s) => ({
            id: s.id,
            title: s.title,
            shortDescription: s.short_description,
            fullDescription: s.full_description,
            iconName: s.icon_name,
            imageUrl: s.image_url,
            features: s.features || [],
            active: s.active,
            order: s.display_order,
          })),
        }));
      }

      // 3. Fetch Portfolio
      const { data: portfolioData, error: pErr } = await client
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (!pErr && portfolioData && portfolioData.length > 0) {
        setSiteData((prev) => ({
          ...prev,
          portfolio: portfolioData.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            powerKwp: Number(p.power_kwp),
            monthlyEconomyRs: Number(p.monthly_economy_rs),
            location: p.location,
            imageUrl: p.image_url,
            description: p.description,
            modulesCount: p.modules_count,
            featured: p.featured,
            active: p.active,
            order: p.display_order,
          })),
        }));
      }

      // 4. Fetch Testimonials
      const { data: testimonialsData, error: tErr } = await client
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (!tErr && testimonialsData && testimonialsData.length > 0) {
        setSiteData((prev) => ({
          ...prev,
          testimonials: testimonialsData.map((t) => ({
            id: t.id,
            clientName: t.client_name,
            roleOrType: t.role_or_type,
            city: t.city,
            rating: t.rating,
            comment: t.comment,
            avatarUrl: t.avatar_url,
            powerKwp: t.power_kwp ? Number(t.power_kwp) : undefined,
            active: t.active,
            order: t.display_order,
          })),
        }));
      }

      // 5. Fetch FAQs
      const { data: faqsData, error: fErr } = await client
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (!fErr && faqsData && faqsData.length > 0) {
        setSiteData((prev) => ({
          ...prev,
          faqs: faqsData.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category,
            active: f.active,
            order: f.display_order,
          })),
        }));
      }

      // 6. Fetch Benefits
      const { data: benefitsData, error: bErr } = await client
        .from('benefits')
        .select('*')
        .order('display_order', { ascending: true });

      if (!bErr && benefitsData && benefitsData.length > 0) {
        setSiteData((prev) => ({
          ...prev,
          benefits: benefitsData.map((b) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            iconName: b.icon_name,
            active: b.active,
            order: b.display_order,
          })),
        }));
      }

      // 7. Fetch Leads
      const { data: leadsData, error: lErr } = await client
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!lErr && leadsData && leadsData.length > 0) {
        setLeads(
          leadsData.map((l) => ({
            id: l.id,
            name: l.name,
            phone: l.phone,
            email: l.email || undefined,
            city: l.city,
            propertyType: l.property_type,
            averageBillValue: Number(l.average_bill_value),
            estimatedKwp: l.estimated_kwp ? Number(l.estimated_kwp) : undefined,
            estimatedEconomy: l.estimated_economy ? Number(l.estimated_economy) : undefined,
            notes: l.notes || undefined,
            status: l.status,
            createdAt: l.created_at,
          }))
        );
      }

      if (!silent) {
        showToast('Dados atualizados a partir do Supabase!', 'info');
      }
    } catch (err: any) {
      console.error('Error pulling data from Supabase:', err);
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }, [showToast]);

  // Initial Sync & Real-time Postgres & Universal Cloud Sync Subscription
  useEffect(() => {
    // 1. Initial Cloud Sync Pull
    const pullInitialCloudData = async () => {
      try {
        const cloudData = await fetchFromCloudSync();
        if (cloudData && cloudData.siteData) {
          const currentLocalTs = getLastCloudTimestamp();
          if (!currentLocalTs || cloudData.timestamp >= currentLocalTs) {
            setLastCloudTimestamp(cloudData.timestamp);
            setSiteData(sanitizeSiteData(cloudData.siteData));
            if (cloudData.leads && cloudData.leads.length > 0) {
              setLeads(cloudData.leads);
            }
            if (cloudData.siteData.currentTheme) {
              applyThemeToDocument(cloudData.siteData.currentTheme);
            }
          }
        }
      } catch (err) {
        console.warn('Initial cloud sync notice:', err);
      }
    };
    pullInitialCloudData();

    // 2. Tab-to-Tab Instant Sync (Same Browser / Multiple Tabs)
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('rc_solar_sync_channel');
        broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.siteData) {
            setSiteData(sanitizeSiteData(event.data.siteData));
            if (event.data.leads) setLeads(event.data.leads);
            if (event.data.siteData.currentTheme) {
              applyThemeToDocument(event.data.siteData.currentTheme);
            }
          }
        };
      }
    } catch {
      // ignore
    }

    // 3. Supabase Realtime Channel
    const client = getSupabaseClient();
    let supabaseChannel: any = null;
    if (client) {
      syncWithSupabase(true);
      supabaseChannel = client
        .channel('rc_solar_realtime_sync')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          syncWithSupabase(true);
        })
        .subscribe();
    }

    // 4. Background Multi-Device Polling Interval (Every 3.5 seconds)
    const pollInterval = setInterval(async () => {
      // Only poll when document is visible to save battery and network
      if (document.hidden) return;

      try {
        const cloudData = await fetchFromCloudSync();
        if (cloudData && cloudData.siteData && cloudData.timestamp) {
          const currentLocalTs = getLastCloudTimestamp();
          if (cloudData.timestamp > currentLocalTs) {
            setLastCloudTimestamp(cloudData.timestamp);
            setSiteData(cloudData.siteData);
            if (cloudData.leads && cloudData.leads.length > 0) {
              setLeads(cloudData.leads);
            }
            if (cloudData.siteData.currentTheme) {
              applyThemeToDocument(cloudData.siteData.currentTheme);
            }
          }
        }
      } catch {
        // quiet retry
      }
    }, 3500);

    return () => {
      clearInterval(pollInterval);
      if (broadcastChannel) broadcastChannel.close();
      if (client && supabaseChannel) client.removeChannel(supabaseChannel);
    };
  }, [syncWithSupabase]);

  const fetchFromSupabase = useCallback(async () => {
    await syncWithSupabase(false);
  }, [syncWithSupabase]);

  // Save and Test Supabase Connection
  const saveAndTestSupabase = useCallback(
    async (url: string, anonKey: string): Promise<{ success: boolean; message: string }> => {
      const cleanUrl = url.trim();
      const cleanKey = anonKey.trim();

      const result = await testSupabaseConnectionApi(cleanUrl, cleanKey);
      const newConfig: SupabaseConfig = {
        url: cleanUrl,
        anonKey: cleanKey,
        isConnected: result.success,
        lastChecked: new Date().toISOString(),
        errorMessage: result.success ? undefined : result.message,
      };

      setSupabaseConfigState(newConfig);
      saveSupabaseConfig(newConfig);

      if (result.success) {
        showToast('Supabase conectado com sucesso!', 'success');
      } else {
        showToast(result.message, 'error');
      }

      return result;
    },
    [showToast]
  );

  // Content Handlers
  const updateGeneralConfig = useCallback((data: Partial<SiteGeneralConfig>) => {
    setSiteData((prev) => {
      const updated = { ...prev, general: { ...prev.general, ...data } };
      autoPushToSupabase(updated);
      return updated;
    });
    showToast('Configurações gerais atualizadas!', 'success');
  }, [autoPushToSupabase, showToast]);

  const updateHeroConfig = useCallback((data: Partial<HeroConfig>) => {
    setSiteData((prev) => {
      const updated = { ...prev, hero: { ...prev.hero, ...data } };
      autoPushToSupabase(updated);
      return updated;
    });
    showToast('Destaque Hero atualizado com sucesso!', 'success');
  }, [autoPushToSupabase, showToast]);

  const updateAboutConfig = useCallback((data: Partial<AboutConfig>) => {
    setSiteData((prev) => {
      const updated = { ...prev, about: { ...prev.about, ...data } };
      autoPushToSupabase(updated);
      return updated;
    });
    showToast('Seção Sobre Nós atualizada!', 'success');
  }, [autoPushToSupabase, showToast]);

  const updateCalculatorConfig = useCallback((data: Partial<SolarCalculatorConfig>) => {
    setSiteData((prev) => {
      const updated = { ...prev, calculator: { ...prev.calculator, ...data } };
      autoPushToSupabase(updated);
      return updated;
    });
    showToast('Parâmetros da calculadora solar atualizados!', 'success');
  }, [autoPushToSupabase, showToast]);

  const setServices = useCallback((services: ServiceItem[]) => {
    setSiteData((prev) => {
      const updated = { ...prev, services };
      autoPushToSupabase(updated);
      return updated;
    });
  }, [autoPushToSupabase]);

  const setPortfolio = useCallback((portfolio: PortfolioItem[]) => {
    setSiteData((prev) => {
      const updated = { ...prev, portfolio };
      autoPushToSupabase(updated);
      return updated;
    });
  }, [autoPushToSupabase]);

  const setTestimonials = useCallback((testimonials: TestimonialItem[]) => {
    setSiteData((prev) => {
      const updated = { ...prev, testimonials };
      autoPushToSupabase(updated);
      return updated;
    });
  }, [autoPushToSupabase]);

  const setFaqs = useCallback((faqs: FaqItem[]) => {
    setSiteData((prev) => {
      const updated = { ...prev, faqs };
      autoPushToSupabase(updated);
      return updated;
    });
  }, [autoPushToSupabase]);

  const setBenefits = useCallback((benefits: BenefitItem[]) => {
    setSiteData((prev) => {
      const updated = { ...prev, benefits };
      autoPushToSupabase(updated);
      return updated;
    });
  }, [autoPushToSupabase]);

  const setTheme = useCallback((theme: ThemeConfig) => {
    setSiteData((prev) => {
      const updated = { ...prev, currentTheme: theme };
      autoPushToSupabase(updated);
      return updated;
    });
    applyThemeToDocument(theme);
    showToast(`Tema "${theme.name}" aplicado!`, 'info');
  }, [autoPushToSupabase, showToast]);

  const saveCustomTheme = useCallback((theme: ThemeConfig) => {
    setSiteData((prev) => {
      const existing = prev.customThemes.filter((t) => t.id !== theme.id);
      const updated = {
        ...prev,
        currentTheme: theme,
        customThemes: [...existing, theme],
      };
      autoPushToSupabase(updated);
      return updated;
    });
    applyThemeToDocument(theme);
    showToast('Tema personalizado salvo e aplicado com sucesso!', 'success');
  }, [autoPushToSupabase, showToast]);

  const resetToDefaultData = useCallback(() => {
    setSiteData(initialSiteData);
    setLeads(sampleLeads);
    try {
      localStorage.removeItem(STORAGE_SITE_DATA_KEY);
      localStorage.removeItem(STORAGE_LEADS_KEY);
      localStorage.removeItem('globo_solar_site_data_v1');
      localStorage.removeItem('globo_solar_site_data');
      localStorage.removeItem('globo_solar_leads_v1');
      localStorage.removeItem('globo_solar_leads_data');
      localStorage.removeItem('globo_solar_cloud_sync_meta');
      localStorage.removeItem('globo_solar_blob_id');
      localStorage.removeItem('globo_solar_admin_auth_hash');
    } catch {}
    applyThemeToDocument(initialSiteData.currentTheme);
    pushToCloudSync(initialSiteData, sampleLeads).catch((e) => console.warn('Cloud sync error:', e));
    showToast('Conteúdo restaurado para o padrão oficial da RC Engenharia Solar.', 'info');
  }, [showToast]);

  // Dedicated Delete Actions (Instant Cloud & Supabase Delete)
  const deleteTestimonial = useCallback(
    async (id: string) => {
      setSiteData((prev) => {
        const updated = {
          ...prev,
          testimonials: prev.testimonials.filter((t) => t.id !== id),
        };
        pushToCloudSync(updated, leads).catch((e) => console.warn('Cloud sync error:', e));
        return updated;
      });

      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('testimonials').delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete testimonial warning:', e);
        }
      }
      showToast('Depoimento / comentário excluído com sucesso!', 'info');
    },
    [leads, showToast]
  );

  const deleteService = useCallback(
    async (id: string) => {
      setSiteData((prev) => {
        const updated = {
          ...prev,
          services: prev.services.filter((s) => s.id !== id),
        };
        pushToCloudSync(updated, leads).catch((e) => console.warn('Cloud sync error:', e));
        return updated;
      });

      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('services').delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete service warning:', e);
        }
      }
      showToast('Serviço excluído com sucesso!', 'info');
    },
    [leads, showToast]
  );

  const deletePortfolioItem = useCallback(
    async (id: string) => {
      setSiteData((prev) => {
        const updated = {
          ...prev,
          portfolio: prev.portfolio.filter((p) => p.id !== id),
        };
        pushToCloudSync(updated, leads).catch((e) => console.warn('Cloud sync error:', e));
        return updated;
      });

      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('portfolio_projects').delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete portfolio warning:', e);
        }
      }
      showToast('Projeto excluído do portfólio com sucesso!', 'info');
    },
    [leads, showToast]
  );

  const deleteFaq = useCallback(
    async (id: string) => {
      setSiteData((prev) => {
        const updated = {
          ...prev,
          faqs: prev.faqs.filter((f) => f.id !== id),
        };
        pushToCloudSync(updated, leads).catch((e) => console.warn('Cloud sync error:', e));
        return updated;
      });

      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('faqs').delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete FAQ warning:', e);
        }
      }
      showToast('Pergunta frequente excluída com sucesso!', 'info');
    },
    [leads, showToast]
  );

  const deleteBenefit = useCallback(
    async (id: string) => {
      setSiteData((prev) => {
        const updated = {
          ...prev,
          benefits: prev.benefits.filter((b) => b.id !== id),
        };
        pushToCloudSync(updated, leads).catch((e) => console.warn('Cloud sync error:', e));
        return updated;
      });

      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('benefits').delete().eq('id', id);
        } catch (e) {
          console.warn('Supabase delete benefit warning:', e);
        }
      }
      showToast('Diferencial excluído com sucesso!', 'info');
    },
    [leads, showToast]
  );

  // Leads Handlers
  const addLead = useCallback(
    async (leadData: Omit<LeadItem, 'id' | 'createdAt'>): Promise<boolean> => {
      const newLead: LeadItem = {
        ...leadData,
        id: 'lead-' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      setLeads((prev) => {
        const updated = [newLead, ...prev];
        pushToCloudSync(siteData, updated).catch((e) => console.warn('Cloud sync lead error:', e));
        return updated;
      });

      // Try sending to Supabase if connected
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('leads').insert({
            name: newLead.name,
            phone: newLead.phone,
            email: newLead.email || null,
            city: newLead.city,
            property_type: newLead.propertyType,
            average_bill_value: newLead.averageBillValue,
            estimated_kwp: newLead.estimatedKwp || null,
            estimated_economy: newLead.estimatedEconomy || null,
            notes: newLead.notes || null,
            status: 'Novo',
            created_at: newLead.createdAt,
          });
        } catch (e) {
          console.warn('Lead saved locally. Supabase insert warning:', e);
        }
      }

      showToast('Solicitação recebida com sucesso! Em breve entraremos em contato.', 'success');
      return true;
    },
    [siteData, showToast]
  );

  const updateLeadStatus = useCallback((id: string, status: LeadItem['status']) => {
    setLeads((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, status } : l));
      pushToCloudSync(siteData, updated).catch((e) => console.warn('Cloud sync lead error:', e));
      return updated;
    });
    // Sync to supabase if connected
    const client = getSupabaseClient();
    if (client) {
      client.from('leads').update({ status }).eq('id', id).then();
    }
  }, [siteData]);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      pushToCloudSync(siteData, updated).catch((e) => console.warn('Cloud sync lead error:', e));
      return updated;
    });
    const client = getSupabaseClient();
    if (client) {
      client.from('leads').delete().eq('id', id).then();
    }
    showToast('Lead removido com sucesso.', 'info');
  }, [siteData, showToast]);

  return (
    <AppContext.Provider
      value={{
        siteData,
        leads,
        supabaseConfig,
        isSupabaseConnected: !!supabaseConfig.isConnected,
        isSyncing,
        isAdminOpen: isAdminLoginModalOpen || isAdminDashboardOpen,
        isAdminLoginModalOpen,
        isAdminDashboardOpen,
        isAdminAuthenticated,
        activeAdminTab,
        isLoading,
        isDarkMode,
        toasts,
        selectedServiceForModal,
        selectedProjectForModal,
        currentTheme: siteData.currentTheme,
        openAdmin,
        closeAdmin,
        setIsAdminOpen,
        setIsAdminLoginModalOpen,
        setIsAdminDashboardOpen,
        setActiveAdminTab,
        loginAdmin,
        changeAdminPassword,
        logoutAdmin,
        setIsDarkMode,
        showToast,
        removeToast,
        setSelectedServiceForModal,
        setSelectedProjectForModal,
        updateGeneralConfig,
        updateHeroConfig,
        updateAboutConfig,
        updateCalculatorConfig,
        setServices,
        setPortfolio,
        setTestimonials,
        setFaqs,
        setBenefits,
        setTheme,
        saveCustomTheme,
        resetToDefaultData,
        addLead,
        updateLeadStatus,
        deleteLead,
        deleteTestimonial,
        deleteService,
        deletePortfolioItem,
        deleteFaq,
        deleteBenefit,
        setSupabaseConfig,
        testSupabaseConnection,
        syncToSupabase,
        fetchFromSupabase,
        saveAndTestSupabase,
        syncWithSupabase,
        pushLocalToSupabase,
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
