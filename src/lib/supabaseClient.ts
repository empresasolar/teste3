import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FullSiteData, LeadItem, SupabaseConfig } from '../types';

const STORAGE_KEY_SUPABASE_CONFIG = 'rc_solar_supabase_config';
const STORAGE_KEY_SITE_DATA = 'rc_solar_site_data';
const STORAGE_KEY_LEADS_DATA = 'rc_solar_leads_data';

// Read env variables if set
const envSupabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '').trim();
const envSupabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').trim();

export function getSavedSupabaseConfig(): SupabaseConfig {
  const hasEnvConfig = Boolean(envSupabaseUrl && envSupabaseAnonKey);
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      const url = parsed.url || envSupabaseUrl;
      const anonKey = parsed.anonKey || envSupabaseAnonKey;
      return {
        url,
        anonKey,
        isConnected: Boolean(parsed.isConnected || (hasEnvConfig && url && anonKey)),
        lastChecked: parsed.lastChecked,
        errorMessage: parsed.errorMessage,
      };
    }
  } catch (e) {
    console.error('Error reading Supabase config from localStorage:', e);
  }

  return {
    url: envSupabaseUrl,
    anonKey: envSupabaseAnonKey,
    isConnected: hasEnvConfig,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving Supabase config to localStorage:', e);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  const effectiveConfig = config || getSavedSupabaseConfig();
  
  if (!effectiveConfig.url || !effectiveConfig.anonKey) {
    return null;
  }

  // Validate URL format
  if (!effectiveConfig.url.startsWith('http://') && !effectiveConfig.url.startsWith('https://')) {
    return null;
  }

  try {
    if (!supabaseInstance || supabaseInstance['supabaseUrl'] !== effectiveConfig.url) {
      supabaseInstance = createClient(effectiveConfig.url, effectiveConfig.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return supabaseInstance;
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    return null;
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL do projeto e Chave Anon são obrigatórias.' };
  }

  try {
    const testClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });

    // Test a basic health ping or table query
    const { error } = await testClient.from('site_settings').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, but authentication worked, code 42P01 means table does not exist
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          success: true,
          message: 'Conectado com sucesso ao Supabase! (Tabelas ainda não criadas. Utilize a aba Banco de Dados para rodar o script SQL)',
        };
      }
      return {
        success: false,
        message: `Erro na autenticação com o Supabase: ${error.message || 'Verifique a chave Anon e a URL.'}`,
      };
    }

    return {
      success: true,
      message: 'Conexão ativa e sincronizada com sucesso!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha ao conectar: ${err.message || 'Erro de rede ou URL inválida.'}`,
    };
  }
}

// Full PostgreSQL Schema Generator tailored for Supabase SQL Editor
export interface DiagnosticResult {
  step: string;
  status: 'pending' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export async function runDatabaseDiagnostics(config?: SupabaseConfig): Promise<DiagnosticResult[]> {
  const effectiveConfig = config || getSavedSupabaseConfig();
  const results: DiagnosticResult[] = [];

  // Step 1: Check Environment / Credentials
  if (!effectiveConfig.url || !effectiveConfig.anonKey) {
    results.push({
      step: '1. Variáveis de Ambiente e Credenciais',
      status: 'error',
      message: 'Chaves de conexão ausentes',
      details: 'As chaves VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não foram encontradas ou estão vazias.',
    });
    return results;
  }

  results.push({
    step: '1. Variáveis de Ambiente e Credenciais',
    status: 'success',
    message: 'Credenciais carregadas com sucesso',
    details: `URL: ${effectiveConfig.url.substring(0, 24)}... | Key: ${effectiveConfig.anonKey.substring(0, 15)}...`,
  });

  // Step 2: Supabase Client Initializer & Network Reachability
  let testClient: SupabaseClient | null = null;
  try {
    testClient = createClient(effectiveConfig.url, effectiveConfig.anonKey, {
      auth: { persistSession: false },
    });
    results.push({
      step: '2. Inicialização do Cliente Supabase',
      status: 'success',
      message: 'Cliente Supabase JS instanciado com sucesso',
    });
  } catch (err: any) {
    results.push({
      step: '2. Inicialização do Cliente Supabase',
      status: 'error',
      message: 'Falha ao instanciar cliente',
      details: err.message,
    });
    return results;
  }

  // Step 3: Check Table `site_settings`
  try {
    const { data: settingsData, error: settingsError } = await testClient
      .from('site_settings')
      .select('id')
      .limit(1);

    if (settingsError) {
      if (settingsError.code === '42P01' || settingsError.message?.includes('does not exist')) {
        results.push({
          step: '3. Existência da Tabela de Configurações (site_settings)',
          status: 'error',
          message: 'Tabela NÃO existe no PostgreSQL (Erro 42P01)',
          details: 'O Supabase conectou, mas a tabela "site_settings" não existe no banco de dados. O PostgreSQL rejeita qualquer gravação até que a tabela seja criada.',
        });
      } else {
        results.push({
          step: '3. Existência da Tabela de Configurações (site_settings)',
          status: 'error',
          message: `Erro ao acessar tabela: ${settingsError.message}`,
          details: `Código de erro: ${settingsError.code || 'Desconhecido'} - ${settingsError.details || ''}`,
        });
      }
    } else {
      results.push({
        step: '3. Existência da Tabela de Configurações (site_settings)',
        status: 'success',
        message: 'Tabela "site_settings" encontrada e acessível no Supabase',
      });
    }
  } catch (err: any) {
    results.push({
      step: '3. Existência da Tabela de Configurações (site_settings)',
      status: 'error',
      message: 'Exceção na requisição de rede',
      details: err.message,
    });
  }

  // Step 4: Check Table `services`
  try {
    const { error: sError } = await testClient.from('services').select('id').limit(1);
    if (sError) {
      results.push({
        step: '4. Tabela de Serviços (services)',
        status: 'error',
        message: sError.code === '42P01' ? 'Tabela "services" NÃO existe' : sError.message,
        details: sError.details || 'Requer criação da tabela no banco.',
      });
    } else {
      results.push({
        step: '4. Tabela de Serviços (services)',
        status: 'success',
        message: 'Tabela "services" ativa e funcional',
      });
    }
  } catch (err: any) {
    results.push({
      step: '4. Tabela de Serviços (services)',
      status: 'error',
      message: 'Falha na verificação de serviços',
      details: err.message,
    });
  }

  // Step 5: Check Table `leads`
  try {
    const { error: lError } = await testClient.from('leads').select('id').limit(1);
    if (lError) {
      results.push({
        step: '5. Tabela de Leads & Contatos (leads)',
        status: 'error',
        message: lError.code === '42P01' ? 'Tabela "leads" NÃO existe' : lError.message,
        details: lError.details || 'Requer criação da tabela no banco.',
      });
    } else {
      results.push({
        step: '5. Tabela de Leads & Contatos (leads)',
        status: 'success',
        message: 'Tabela "leads" ativa e funcional',
      });
    }
  } catch (err: any) {
    results.push({
      step: '5. Tabela de Leads & Contatos (leads)',
      status: 'error',
      message: 'Falha na verificação de leads',
      details: err.message,
    });
  }

  // Step 6: Test Write / Permissão RLS
  try {
    const testId = 'diagnostic_test_ping';
    const { error: writeError } = await testClient.from('site_settings').upsert({
      id: testId,
      general: {},
      hero: {},
      about: {},
      calculator: {},
      current_theme: {},
      custom_themes: [],
      updated_at: new Date().toISOString(),
    });

    if (writeError) {
      results.push({
        step: '6. Permissão de Gravação / Políticas RLS',
        status: 'error',
        message: 'Gravação bloqueada ou tabela ausente',
        details: `${writeError.message} (Código: ${writeError.code || 'N/A'})`,
      });
    } else {
      // Clean up test ping
      await testClient.from('site_settings').delete().eq('id', testId);
      results.push({
        step: '6. Permissão de Gravação / Políticas RLS',
        status: 'success',
        message: 'Gravação e exclusão permitidas com sucesso',
      });
    }
  } catch (err: any) {
    results.push({
      step: '6. Permissão de Gravação / Políticas RLS',
      status: 'error',
      message: 'Falha no teste de gravação',
      details: err.message,
    });
  }

  return results;
}

export function generateSupabaseSqlScript(): string {
  return `-- ==============================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS RC ENGENHARIA SOLAR (SUPABASE / POSTGRESQL)
-- Desenvolvido para WETA SISTEMAS - Rio Branco / Acre
-- ==============================================================================

-- 1. EXTENSÕES ÚTEIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE CONFIGURAÇÕES GERAIS E CONTEÚDO PRINCIPAL
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  general JSONB NOT NULL,
  hero JSONB NOT NULL,
  about JSONB NOT NULL,
  calculator JSONB NOT NULL,
  current_theme JSONB NOT NULL,
  custom_themes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE SERVIÇOS
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE PROJETOS E PORTFÓLIO
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Residencial', 'Comercial', 'Rural', 'Industrial')),
  power_kwp NUMERIC(8,2) NOT NULL,
  monthly_economy_rs NUMERIC(10,2) NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  modules_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE DEPOIMENTOS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  role_or_type TEXT NOT NULL,
  city TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  power_kwp NUMERIC(8,2),
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA DE PERGUNTAS FREQUENTES (FAQ)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Geral',
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABELA DE BENEFÍCIOS
CREATE TABLE IF NOT EXISTS public.benefits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABELA DE LEADS E SOLICITAÇÕES DE ORÇAMENTO
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('Residencial', 'Comercial', 'Rural', 'Industrial')),
  average_bill_value NUMERIC(10,2) NOT NULL,
  estimated_kwp NUMERIC(8,2),
  estimated_economy NUMERIC(10,2),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Novo' CHECK (status IN ('Novo', 'Em Atendimento', 'Proposta Enviada', 'Fechado', 'Perdido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABELA DE AUTENTICAÇÃO ADMINISTRATIVA (HASH CRIPTOGRÁFICO SEGURO)
CREATE TABLE IF NOT EXISTS public.admin_auth (
  id TEXT PRIMARY KEY DEFAULT 'primary_admin',
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserção de credencial administrativa primária (Hash SHA-256)
INSERT INTO public.admin_auth (id, password_hash)
VALUES ('primary_admin', 'a6a75a84f1f2f77924030ae1f13b45bae5872147dcc89763c02449c13ec85e23')
ON CONFLICT (id) DO NOTHING;

-- 10. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_services_active_order ON public.services(active, display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_active_cat ON public.portfolio_projects(active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(active, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(active, category, display_order);
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON public.leads(status, created_at DESC);

-- 11. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas existentes para evitar duplicidade
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Services" ON public.services;
DROP POLICY IF EXISTS "Public Read Portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Faqs" ON public.faqs;
DROP POLICY IF EXISTS "Public Read Benefits" ON public.benefits;
DROP POLICY IF EXISTS "Public Read Admin Auth" ON public.admin_auth;
DROP POLICY IF EXISTS "Public Insert Leads" ON public.leads;
DROP POLICY IF EXISTS "Allow All on Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow All on Services" ON public.services;
DROP POLICY IF EXISTS "Allow All on Portfolio" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow All on Testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow All on Faqs" ON public.faqs;
DROP POLICY IF EXISTS "Allow All on Benefits" ON public.benefits;
DROP POLICY IF EXISTS "Allow All on Leads" ON public.leads;
DROP POLICY IF EXISTS "Allow All on Admin Auth" ON public.admin_auth;

-- Políticas universais de leitura e gravação para sincronização completa
CREATE POLICY "Allow All on Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Portfolio" ON public.portfolio_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Benefits" ON public.benefits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Admin Auth" ON public.admin_auth FOR ALL USING (true) WITH CHECK (true);

-- 12. HABILITAR ATUALIZAÇÕES EM TEMPO REAL (SUPABASE REALTIME)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings, public.services, public.portfolio_projects, public.testimonials, public.faqs, public.benefits, public.leads;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_object THEN NULL;
  END;
END $$;
`;
}
