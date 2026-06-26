// Analytics script loaders. These run ONLY after the user grants
// analytics consent via the cookie banner — never on first load.

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

export function loadClarity(): void {
  if (!CLARITY_ID) return;
  if (document.querySelector('script[data-clarity="true"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  script.dataset.clarity = "true";
  document.head.appendChild(script);
}

// Signal Clarity's consent API. Called after the script is present.
export function updateClarityConsent(granted: boolean): void {
  if (typeof window.clarity === "function") {
    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: granted ? "granted" : "denied",
    });
  }
}

export function enableAnalytics(): void {
  loadClarity();
  updateClarityConsent(true);
}

export function disableAnalytics(): void {
  updateClarityConsent(false);
}
