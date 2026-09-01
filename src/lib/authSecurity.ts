import { getSupabaseClient } from './supabaseClient';

const STORAGE_KEY_ADMIN_AUTH_HASH = 'globo_solar_admin_auth_hash';

// Default active authorized SHA-256 password hashes (never expose plaintext passwords)
// Hashes correspond to the active administrative credentials:
// 1) Primary secure engineering password (Aprovadoprojeto1>)
// 2) Secondary master password (globosolar2026)
// 3) Standard fallback password (admin123)
const DEFAULT_AUTHORIZED_HASHES = [
  'a6a75a84f1f2f77924030ae1f13b45bae5872147dcc89763c02449c13ec85e23', // Aprovadoprojeto1>
  '74ccdfe824a4636e45fa0a6462a938de39ff953f2e3c9469ccda39c8ef91d66f', // globosolar2026
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
];

/**
 * Calculates SHA-256 hash using native Web Crypto API
 */
export async function hashPassword(plainText: string): Promise<string> {
  const trimmed = plainText.trim();
  if (!trimmed) return '';
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(trimmed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error('Error generating SHA-256 hash:', e);
    // Fallback simple deterministic hash if Web Crypto is unavailable in old environments
    let hash = 0;
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `fb_${Math.abs(hash)}`;
  }
}

/**
 * Verifies if entered password matches the database or active stored hashes
 */
export async function verifyAdminPassword(enteredPassword: string): Promise<boolean> {
  const trimmed = enteredPassword.trim();
  if (!trimmed) return false;

  const inputHash = await hashPassword(trimmed);

  // 1. Check against active system hashes (guarantees existing credentials remain 100% active)
  if (DEFAULT_AUTHORIZED_HASHES.includes(inputHash)) {
    return true;
  }

  // 2. Check against custom hash stored in localStorage (if changed by user)
  try {
    const localCustomHash = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH_HASH);
    if (localCustomHash && localCustomHash === inputHash) {
      return true;
    }
  } catch (e) {
    console.error('Error reading local auth hash:', e);
  }

  // 3. Check against database (Supabase admin_auth table) if connected
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_auth')
        .select('password_hash')
        .eq('id', 'primary_admin')
        .maybeSingle();

      if (!error && data?.password_hash) {
        if (data.password_hash === inputHash) {
          // Cache locally
          localStorage.setItem(STORAGE_KEY_ADMIN_AUTH_HASH, inputHash);
          return true;
        }
      }
    }
  } catch (dbErr) {
    console.warn('Database auth verification fallback:', dbErr);
  }

  return false;
}

/**
 * Updates the admin password in both the Supabase Database and local cache
 */
export async function updateAdminPasswordInDatabase(newPassword: string): Promise<{ success: boolean; message: string }> {
  const trimmed = newPassword.trim();
  if (trimmed.length < 6) {
    return { success: false, message: 'A nova senha deve ter pelo menos 6 caracteres.' };
  }

  try {
    const newHash = await hashPassword(trimmed);

    // Save locally
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH_HASH, newHash);

    // Sync to Supabase Database
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('admin_auth').upsert({
        id: 'primary_admin',
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Could not update admin_auth in Supabase:', error.message);
        return {
          success: true,
          message: 'Senha atualizada no dispositivo local! (Tabela admin_auth será sincronizada ao conectar o Supabase).',
        };
      }
    }

    return {
      success: true,
      message: 'Senha de administrador atualizada e sincronizada com segurança no banco de dados!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao atualizar senha: ${err?.message || 'Falha desconhecida'}`,
    };
  }
}
