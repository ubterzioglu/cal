import { Link } from "react-router-dom";
import { openCookiePreferences } from "@/legal/consent";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="container py-12 text-center text-xs">
        <div className="flex flex-col items-center gap-3">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="font-semibold text-white text-sm">CAL Community</span>
            </div>
          </div>

          <div className="text-white/70">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <Link
                to="/contact"
                className="font-semibold text-white transition-colors hover:text-white"
              >
                İletişim
              </Link>
              <span className="text-white/40">|</span>
              <Link
                to="/gizlilik-politikasi"
                className="font-semibold text-white transition-colors hover:text-white"
              >
                Gizlilik Politikası
              </Link>
              <span className="text-white/40">|</span>
              <Link
                to="/kvkk"
                className="font-semibold text-white transition-colors hover:text-white"
              >
                KVKK Aydınlatma Metni
              </Link>
              <span className="text-white/40">|</span>
              <Link
                to="/cerez-politikasi"
                className="font-semibold text-white transition-colors hover:text-white"
              >
                Çerez Politikası
              </Link>
              <span className="text-white/40">|</span>
              <Link
                to="/kullanim-sartlari"
                className="font-semibold text-white transition-colors hover:text-white"
              >
                Kullanım Şartları ve Sorumluluk Reddi
              </Link>
              <span className="text-white/40">|</span>
              <Link
                to="/acik-riza"
                className="font-semibold text-white transition-colors hover:text-white"
              >
                Açık Rıza Metni
              </Link>
              <span className="text-white/40">|</span>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="font-semibold text-white transition-colors hover:text-white"
              >
                Çerez Tercihleri
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-white/70 space-y-2 leading-relaxed">
          <p>
            Bu topluluk gayriresmidir ve CALMED veya Cağaloğlu Anadolu Lisesi ya da diğer oluşumlarla bağlantılı değildir.
          </p>
          <p>KVKK ve öğrencilerimizi korumak amacıyla öğrencilerimizin isimleri sadece isim ve soyisminin baş harfleri ile verilmektedir.</p>
          <p>
            Veri sahibi başvuruları ve hukuki bildirimler için:{" "}
            <a href="mailto:ubterzioglu@gmail.com" className="underline hover:text-white">
              ubterzioglu@gmail.com
            </a>
          </p>
          <p className="text-white/50">Yasal metinler son güncelleme: 05.07.2026 · Sürüm v2.1</p>
          <p>© {new Date().getFullYear()} CAL Community. Tüm hakları saklıdır.</p>
          <p className="space-x-1">
            <a href="https://chatio.com.tr/" rel="dofollow" className="underline hover:text-white">
              Canlı Destek Yazılımı
            </a>
            <span>·</span>
            <a href="https://www.spindorai.com/seo/en-iyi-seo-ajansi" rel="dofollow" className="underline hover:text-white">
              Seo Ajansı
            </a>
            <span>Spindora Tarafından Seosu Yapılmıştır.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
