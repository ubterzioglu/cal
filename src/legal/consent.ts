// Cookie consent state persisted in localStorage.
// Necessary cookies are always on; analytics is opt-in.

export const COOKIE_POLICY_VERSION = "cookies-v2.0";

// Event the footer link dispatches to re-open the banner/preferences.
export const OPEN_COOKIE_PREFERENCES_EVENT = "cal:open-cookie-preferences";

const STORAGE_KEY = "cal_cookie_consent";

export function openCookiePreferences(): void {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
}

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  timestamp: string;
  policyVersion: string;
}

export function getConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Re-prompt if the policy version changed.
    if (parsed.policyVersion !== COOKIE_POLICY_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): ConsentState {
  const consent: ConsentState = {
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
    policyVersion: COOKIE_POLICY_VERSION,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage may be unavailable (private mode); fail silently.
  }
  return consent;
}
