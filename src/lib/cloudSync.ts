import { FullSiteData, LeadItem } from '../types';

// Global Cloud Sync Channel identifier for RC Engenharia Solar
const CLOUD_SYNC_APP_ID = 'rc_engenharia_solar_ac_v2';
const STORAGE_SYNC_KEY = 'rc_solar_cloud_sync_meta';

interface CloudPayload {
  siteData: FullSiteData;
  leads: LeadItem[];
  timestamp: number;
  author?: string;
}

// Memory cache to avoid redundant updates
let lastKnownTimestamp = 0;

// Read local sync timestamp if available
try {
  const savedMeta = localStorage.getItem(STORAGE_SYNC_KEY);
  if (savedMeta) {
    const parsed = JSON.parse(savedMeta);
    if (parsed.timestamp) {
      lastKnownTimestamp = parsed.timestamp;
    }
  }
} catch (e) {
  // ignore
}

/**
 * Robust Multi-Provider Cloud KV Storage for Zero-SQL Instant Multi-Device Sync
 */
const CLOUD_STORAGE_PROVIDERS = [
  // Provider 1: KVdb.io (High-speed key-value store, reliable for web apps)
  {
    name: 'kvdb',
    getUrl: () => `https://kvdb.io/4yKqP4ZkRk3n2p9bJ5wL1m/${CLOUD_SYNC_APP_ID}`,
    save: async (payload: CloudPayload): Promise<boolean> => {
      const res = await fetch(`https://kvdb.io/4yKqP4ZkRk3n2p9bJ5wL1m/${CLOUD_SYNC_APP_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    },
    load: async (): Promise<CloudPayload | null> => {
      const res = await fetch(`https://kvdb.io/4yKqP4ZkRk3n2p9bJ5wL1m/${CLOUD_SYNC_APP_ID}?t=${Date.now()}`);
      if (!res.ok) return null;
      return await res.json();
    },
  },
  // Provider 2: Backup Cloud Storage endpoint
  {
    name: 'jsonblob',
    save: async (payload: CloudPayload): Promise<boolean> => {
      let blobId = localStorage.getItem('rc_solar_blob_id');
      try {
        if (!blobId) {
          const res = await fetch('https://jsonblob.com/api/jsonBlob', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const location = res.headers.get('Location') || res.headers.get('x-jsonblob');
            if (location) {
              const parts = location.split('/');
              blobId = parts[parts.length - 1];
              localStorage.setItem('rc_solar_blob_id', blobId);
              return true;
            }
          }
        } else {
          const res = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          return res.ok;
        }
      } catch {
        return false;
      }
      return false;
    },
    load: async (): Promise<CloudPayload | null> => {
      const blobId = localStorage.getItem('rc_solar_blob_id');
      if (!blobId) return null;
      try {
        const res = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}?t=${Date.now()}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },
  },
];

/**
 * Save site data & leads to Cloud Sync across all available cloud providers
 */
export async function pushToCloudSync(siteData: FullSiteData, leads: LeadItem[]): Promise<boolean> {
  const timestamp = Date.now();
  lastKnownTimestamp = timestamp;

  const payload: CloudPayload = {
    siteData,
    leads,
    timestamp,
  };

  // Save metadata locally
  try {
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify({ timestamp }));
  } catch {
    // ignore
  }

  // Notify other tabs on the same browser immediately
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('rc_solar_sync_channel');
      bc.postMessage(payload);
      bc.close();
    }
  } catch {
    // ignore
  }

  // Push to cloud providers in parallel
  let anySuccess = false;
  for (const provider of CLOUD_STORAGE_PROVIDERS) {
    try {
      const success = await provider.save(payload);
      if (success) {
        anySuccess = true;
        break;
      }
    } catch (e) {
      console.warn(`[CloudSync] Provider ${provider.name} failed to save:`, e);
    }
  }

  return anySuccess;
}

/**
 * Fetch latest site data from Cloud Sync
 */
export async function fetchFromCloudSync(): Promise<{ siteData: FullSiteData; leads: LeadItem[]; timestamp: number } | null> {
  for (const provider of CLOUD_STORAGE_PROVIDERS) {
    try {
      const payload = await provider.load();
      if (payload && payload.siteData && payload.timestamp) {
        return payload;
      }
    } catch (e) {
      console.warn(`[CloudSync] Provider ${provider.name} failed to load:`, e);
    }
  }
  return null;
}

/**
 * Get current cached cloud timestamp
 */
export function getLastCloudTimestamp(): number {
  return lastKnownTimestamp;
}

export function setLastCloudTimestamp(ts: number): void {
  lastKnownTimestamp = ts;
}
