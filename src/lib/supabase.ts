import { createClient } from "@supabase/supabase-js";

// Unique id per browser tab. sessionStorage is per-tab and survives refresh.
function getTabId(): string {
  try {
    let id = sessionStorage.getItem("vs.tabId");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("vs.tabId", id);
    }
    return id;
  } catch {
    return "default";
  }
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: window.sessionStorage,
      // Per-tab key: stops Supabase from syncing login between tabs
      storageKey: `sb-vyaparsathi-${getTabId()}`,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);