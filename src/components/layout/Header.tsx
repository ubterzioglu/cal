import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="CAL Community logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="hidden font-semibold sm:inline-block">CAL Community</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Ana Sayfa
          </Link>
          <Link to="/clubs" className="text-sm font-medium hover:text-primary transition-colors">
            Öğrenci Kulüpleri
          </Link>
          <Link to="/etkinlikler" className="text-sm font-medium hover:text-primary transition-colors">
            Öğrenci Etkinlikleri
          </Link>
          <Link to="/takimlar" className="text-sm font-medium hover:text-primary transition-colors">
            Öğrenci Takımları
          </Link>
          <Link to="/news" className="text-sm font-medium hover:text-primary transition-colors">
            Haberler
          </Link>
          <Button size="sm">Katıl</Button>
        </nav>

        {/* Menu Button */}
        <button
          className="p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="absolute right-0 top-0 h-screen w-[50vw] max-w-[360px] rounded-none bg-[#8f1627] p-4 flex flex-col gap-4 shadow-lg text-white">
            <button
              className="text-left text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menü Kapat
            </button>
            <Link
              to="/"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/clubs"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Öğrenci Kulüpleri
            </Link>
            <Link
              to="/etkinlikler"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Öğrenci Etkinlikleri
            </Link>
            <Link
              to="/takimlar"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Öğrenci Takımları
            </Link>
            <Link
              to="/news"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Haberler
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Giriş
            </Link>
            <Link
              to="/gizlilik-politikasi"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gizlilik Politikası
            </Link>
            <Link
              to="/kvkk"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              KVKK Aydınlatma Metni
            </Link>
            <Link
              to="/cerez-politikasi"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Çerez Politikası
            </Link>
            <Link
              to="/kullanim-sartlari"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Kullanım Şartları ve Sorumluluk Reddi
            </Link>
            <Link
              to="/acik-riza"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Açık Rıza Metni
            </Link>
            <Link
              to="/"
              className="text-sm font-medium hover:text-white/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Katıl
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
