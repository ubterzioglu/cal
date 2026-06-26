import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getConsent,
  saveConsent,
  OPEN_COOKIE_PREFERENCES_EVENT,
} from "@/legal/consent";
import { enableAnalytics, disableAnalytics } from "@/legal/loaders";

/**
 * Cookie consent banner.
 * - Shows on first visit (no stored consent for the current policy version).
 * - Applies previously stored consent on mount, so analytics loads on repeat
 *   visits only if the user had accepted.
 * - Re-opens when the footer "Çerez Tercihleri" link dispatches the open event.
 * - "Kabul Et" and "Reddet" are given equal visual weight (KVKK rehberi).
 */
const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (existing) {
      // Honor the stored decision without showing the banner.
      if (existing.analytics) {
        enableAnalytics();
      }
    } else {
      setVisible(true);
    }

    const openHandler = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openHandler);
    return () =>
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openHandler);
  }, []);

  const handleAccept = () => {
    saveConsent(true);
    enableAnalytics();
    setVisible(false);
  };

  const handleReject = () => {
    saveConsent(false);
    disableAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/95 text-white backdrop-blur"
    >
      <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-white/80">
          Bu sitede zorunlu çerezlerin yanı sıra, kullanımı ölçmek için isteğe bağlı
          analitik çerezler (Microsoft Clarity) kullanılır. Analitik
          çerezler yalnızca onayınızla yüklenir. Ayrıntılar için{" "}
          <Link to="/cerez-politikasi" className="underline hover:text-white">
            Çerez Politikası
          </Link>
          'nı inceleyebilirsiniz.
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-md border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
