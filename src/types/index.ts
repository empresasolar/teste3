export interface SiteGeneralConfig {
  companyName: string;
  companySlogan: string;
  tagline: string;
  description: string;
  logoText: string;
  logoSubtext: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  cityState: string;
  workingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  googleMapsUrl?: string;
  footerAbout: string;
  developerCredit: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  iconName: string;
}

export interface HeroConfig {
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaAction: 'calculator' | 'contact' | 'whatsapp';
  secondaryCtaText: string;
  secondaryCtaAction: 'calculator' | 'portfolio' | 'services' | 'contact' | 'whatsapp';
  bannerImageUrl: string;
  stats: StatItem[];
}

export interface SolarCalculatorConfig {
  title: string;
  subtitle: string;
  averageKwhPrice: number; // e.g. 0.95 R$/kWh
  averageSunHoursPerDay: number; // e.g. 4.8 hours
  co2PerKwhKg: number; // e.g. 0.084 kg CO2
  treesPerTonCo2: number; // e.g. 7 trees
  averageSystemCostPerKwp: number; // e.g. 3800 R$/kWp
  defaultMonthlyBill: number; // e.g. 650 R$
  disclaimer: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl: string;
  features: string[];
  active: boolean;
  order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Residencial' | 'Comercial' | 'Rural' | 'Industrial';
  powerKwp: number;
  monthlyEconomyRs: number;
  location: string;
  imageUrl: string;
  description: string;
  modulesCount: number;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  roleOrType: string;
  city: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  powerKwp?: number;
  active: boolean;
  order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Economia' | 'Instalação' | 'Financiamento' | 'Garantia e Manutenção' | 'Geral';
  active: boolean;
  order: number;
}

export interface AboutConfig {
  badge: string;
  title: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  mainImageUrl: string;
  secondaryImageUrl: string;
  experienceYears: number;
  features: {
    id: string;
    title: string;
    description: string;
    iconName: string;
  }[];
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  active: boolean;
  order: number;
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  propertyType: 'Residencial' | 'Comercial' | 'Rural' | 'Industrial';
  averageBillValue: number;
  estimatedKwp?: number;
  estimatedEconomy?: number;
  notes?: string;
  status: 'Novo' | 'Em Atendimento' | 'Proposta Enviada' | 'Fechado' | 'Perdido';
  createdAt: string;
}

export type ThemeId =
  | 'solar-gold'
  | 'eco-green'
  | 'blue-tech'
  | 'dark-premium'
  | 'sunset-orange'
  | 'solar-clean-light'
  | string;

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
  };
  borderRadius: 'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-2xl';
  fontFamily: 'sans' | 'display';
}

export interface FullSiteData {
  general: SiteGeneralConfig;
  hero: HeroConfig;
  about: AboutConfig;
  calculator: SolarCalculatorConfig;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  benefits: BenefitItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  currentTheme: ThemeConfig;
  customThemes: ThemeConfig[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastChecked?: string;
  errorMessage?: string;
}
