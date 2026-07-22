import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquarePlus, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 lg:py-32">
      {/* Hareketli gradient blob'lar */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-48 -left-40 h-96 w-96 rounded-full bg-alm-blue/10 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-office4/10 blur-3xl animate-float" />
      </div>

      {/* İnce ızgara dokusu */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center opacity-0 animate-fade-in-up [animation-delay:80ms]">
            <div className="relative rounded-full p-1 animate-pulse-glow">
              <img
                src="/logo.png"
                alt="CAL Community logo"
                className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 object-contain rounded-full drop-shadow transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-xl"
              />
            </div>
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-white opacity-0 animate-fade-in-up [animation-delay:160ms]">
            <Sparkles size={16} className="text-office4" />
            <span>Öğrenciler &amp; Mezunlar Bir Arada</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl opacity-0 animate-fade-in-up [animation-delay:240ms]">
            <span className="block">
              <span className="text-[#8f1627]">CAL</span> Community Web'e
            </span>
            <span className="block">
              Hoş Geldin <span className="text-[#8f1627]">CAL</span>'lı!
            </span>
          </h1>

          <p className="mb-2 text-lg text-muted-foreground sm:text-xl opacity-0 animate-fade-in-up [animation-delay:320ms]">
            Cağaloğlu Anadolu Lisesi'nin öğrenci ve mezunlarını bir araya getiren dijital topluluk platformu.
          </p>
          <p className="mb-8 text-sm text-muted-foreground opacity-0 animate-fade-in-up [animation-delay:380ms]">
            Platformumuz gayriresmi ve gönüllü bir oluşumdur. Başka hiç bir organizasyonla bağlantısı yoktur.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 opacity-0 animate-fade-in-up [animation-delay:460ms]">
            <Button
              size="lg"
              asChild
              className="gap-2 sm:flex-1 transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              <Link to="/login">
                Topluluğa Katıl
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="sm:flex-1 transition-colors duration-200 hover:border-primary/50 hover:text-white"
            >
              <a href="#how-it-works">Beni Oku!</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 sm:flex-1 transition-colors duration-200 hover:border-primary/50 hover:text-white"
            >
              <a href="#feedback">
                <MessageSquarePlus size={18} />
                Geri Bildirim Ver
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
