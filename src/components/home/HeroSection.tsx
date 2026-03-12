import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/70">
            DEMO Sayfasıdır. Çok yakında sizlerleyiz!
          </p>
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="CAL Community logo"
              className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 object-contain rounded-full drop-shadow transition-transform duration-300 ease-in-out hover:scale-105 hover:drop-shadow-xl"
            />
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-white">
            <Users size={16} />
            <span>Öğrenciler & Mezunlar Bir Arada</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">
              <span className="text-[#8f1627]">CAL</span> Community Web'e
            </span>
            <span className="block">
              Hoş Geldin <span className="text-[#8f1627]">CAL</span>'lı!
            </span>
          </h1>

          <p className="mb-2 text-lg text-muted-foreground sm:text-xl">
            Cağaloğlu Anadolu Lisesi'nin öğrenci ve mezunlarını bir araya getiren dijital topluluk platformu.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Platformumuz gayriresmi ve gönüllü bir oluşumdur. Başka hiç bir organizasyonla bağlantısı yoktur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2">
              Topluluğa Katıl
              <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">Beni Oku!</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
};

export default HeroSection;
