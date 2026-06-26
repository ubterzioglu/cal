import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/jsonLd";

const Contact = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="İletişim"
        description="CAL Community ile iletişime geçin. Veri sahibi başvuruları ve hukuki bildirimler için iletişim bilgileri."
        path="/contact"
        jsonLd={breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "İletişim", path: "/contact" },
        ])}
      />
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">İletişim</h1>
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.6fr] md:items-start">
            <div className="space-y-2 text-muted-foreground">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Umut Barış Terzioğlu</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>2003 Cağaloğlu Anadolu Lisesi Mezunu</span>
                  <span className="text-white/40">|</span>
                  <span>Makine Mühendisi</span>
                  <span className="text-white/40">|</span>
                  <span>Yazılım Test Mühendisi</span>
                  <span className="text-white/40">|</span>
                  <span>CAL Community Kurucu Mezun</span>
                  <span className="text-white/40">|</span>
                  <span>UBT</span>
                </div>
              </div>
              <p>
                <a className="hover:underline" href="mailto:ubterzioglu@gmail.com">
                  ubterzioglu@gmail.com
                </a>
              </p>
              <p>
                <a className="hover:underline" href="https://wa.me/905302404995" target="_blank" rel="noreferrer">
                  +90 530 240 49 95
                </a>
              </p>
              <p>
                <a className="hover:underline" href="https://wa.me/491739569429" target="_blank" rel="noreferrer">
                  +49 173 956 94 29
                </a>
              </p>
              <p>Gutenbergstrasse 28 44139 Dortmund Almanya</p>
              <p>
                <a className="hover:underline" href="https://ubterzioglu.de/" target="_blank" rel="noreferrer">
                  https://ubterzioglu.de/
                </a>
              </p>
              <p>
                <a
                  className="hover:underline"
                  href="https://linkedin.com/in/ubterzioglu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://linkedin.com/in/ubterzioglu/
                </a>
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <img
                src="/jpgubt.jpg"
                alt="Umut Barış Terzioğlu"
                className="h-56 w-56 rounded-full object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
