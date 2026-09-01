import { ThemeConfig } from '../types';

export const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'solar-gold',
    name: 'Solar Gold Modern (Padrão)',
    description: 'Amarelo ouro solar com contrastes escuros de altíssima visibilidade e autoridade.',
    mode: 'dark',
    colors: {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      primaryLight: '#fef3c7',
      secondary: '#0f172a',
      accent: '#38bdf8',
      background: '#020617',
      surface: '#0f172a',
      surfaceAlt: '#1e293b',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: '#1e293b',
    },
    borderRadius: 'rounded-2xl',
    fontFamily: 'sans',
  },
  {
    id: 'eco-green',
    name: 'Eco Green Sustentabilidade',
    description: 'Verde esmeralda sustentável, ideal para agronegócio, fazendas solares e energia verde.',
    mode: 'dark',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#d1fae5',
      secondary: '#064e3b',
      accent: '#34d399',
      background: '#022c22',
      surface: '#064e3b',
      surfaceAlt: '#065f46',
      text: '#ecfdf5',
      textMuted: '#6ee7b7',
      border: '#047857',
    },
    borderRadius: 'rounded-xl',
    fontFamily: 'sans',
  },
  {
    id: 'blue-tech',
    name: 'Blue Tech Engenharia & Usinas',
    description: 'Azul ciano tecnológico de alta confiabilidade para indústrias e grandes usinas.',
    mode: 'dark',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      primaryLight: '#e0f2fe',
      secondary: '#0c4a6e',
      accent: '#38bdf8',
      background: '#030712',
      surface: '#0b1329',
      surfaceAlt: '#111e38',
      text: '#f0fdfa',
      textMuted: '#94a3b8',
      border: '#1e293b',
    },
    borderRadius: 'rounded-2xl',
    fontFamily: 'sans',
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium Ônix & Dourado',
    description: 'Preto ônix com dourado metálico refinado e presença imponente.',
    mode: 'dark',
    colors: {
      primary: '#eab308',
      primaryHover: '#ca8a04',
      primaryLight: '#fef9c3',
      secondary: '#18181b',
      accent: '#f59e0b',
      background: '#09090b',
      surface: '#18181b',
      surfaceAlt: '#27272a',
      text: '#fafafa',
      textMuted: '#a1a1aa',
      border: '#27272a',
    },
    borderRadius: 'rounded-xl',
    fontFamily: 'sans',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange Alta Conversão',
    description: 'Laranja vibrante do pôr do sol solar focado em máxima atratividade e CTA.',
    mode: 'dark',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      primaryLight: '#ffedd5',
      secondary: '#1c1917',
      accent: '#fbbf24',
      background: '#0c0a09',
      surface: '#1c1917',
      surfaceAlt: '#292524',
      text: '#fafaf9',
      textMuted: '#a8a29e',
      border: '#292524',
    },
    borderRadius: 'rounded-2xl',
    fontFamily: 'sans',
  },
  {
    id: 'solar-clean-light',
    name: 'Clean Light Solar',
    description: 'Modo claro cristalino com detalhes em laranja e azul petróleo institucional.',
    mode: 'light',
    colors: {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      primaryLight: '#fef3c7',
      secondary: '#0f172a',
      accent: '#0284c7',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceAlt: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
    },
    borderRadius: 'rounded-2xl',
    fontFamily: 'sans',
  },
];

// Helper to calculate darker shade for hover
function adjustColorBrightness(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  
  const num = parseInt(cleanHex, 16);
  let r = (num >> 16) + Math.round((255 * percent) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Apply dark/light class
  if (theme.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const primary = theme.colors.primary || '#f59e0b';
  const primaryHover = theme.colors.primaryHover || adjustColorBrightness(primary, -15);
  const primaryLight = theme.colors.primaryLight || adjustColorBrightness(primary, 70);
  const secondary = theme.colors.secondary || '#0f172a';
  const accent = theme.colors.accent || '#38bdf8';
  const background = theme.colors.background || (theme.mode === 'dark' ? '#020617' : '#ffffff');
  const surface = theme.colors.surface || (theme.mode === 'dark' ? '#0f172a' : '#ffffff');
  const surfaceAlt = theme.colors.surfaceAlt || (theme.mode === 'dark' ? '#1e293b' : '#f8fafc');
  const text = theme.colors.text || (theme.mode === 'dark' ? '#f8fafc' : '#0f172a');
  const textMuted = theme.colors.textMuted || (theme.mode === 'dark' ? '#94a3b8' : '#64748b');
  const border = theme.colors.border || (theme.mode === 'dark' ? '#1e293b' : '#e2e8f0');

  // Set CSS Variables
  root.style.setProperty('--color-primary', primary);
  root.style.setProperty('--color-primary-hover', primaryHover);
  root.style.setProperty('--color-primary-light', primaryLight);
  root.style.setProperty('--color-secondary', secondary);
  root.style.setProperty('--color-accent', accent);
  root.style.setProperty('--color-background', background);
  root.style.setProperty('--color-surface', surface);
  root.style.setProperty('--color-surface-alt', surfaceAlt);
  root.style.setProperty('--color-text', text);
  root.style.setProperty('--color-text-muted', textMuted);
  root.style.setProperty('--color-border', border);

  // Set border radius variable
  let radiusPx = '14px';
  if (theme.borderRadius === 'rounded-none') radiusPx = '0px';
  if (theme.borderRadius === 'rounded-md') radiusPx = '6px';
  if (theme.borderRadius === 'rounded-xl') radiusPx = '14px';
  if (theme.borderRadius === 'rounded-2xl') radiusPx = '20px';

  root.style.setProperty('--app-border-radius', radiusPx);
}

