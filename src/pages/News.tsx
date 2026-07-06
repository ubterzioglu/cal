import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Seo from "@/seo/Seo";

const newsItems = [
  {
    id: 1,
    title: "CALCOM Web Açılıyor",
    summary: "CALCOM web sitesi yayında. Topluluğumuzun tüm duyurularını ve güncellemelerini buradan takip edebilirsiniz.",
    date: "1 Şubat 2026"
  }
];

const News = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Haberler & Duyurular"
        description="CAL topluluğundan en güncel haberler ve duyurular."
        path="/news"
        noindex
      />
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Haberler & Duyurular
              </h1>
              <p className="text-lg text-muted-foreground">
                CAL topluluğundan en güncel haberler ve duyurular.
              </p>
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-6">
              {newsItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar size={14} />
                      <time>{item.date}</time>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {item.summary}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
