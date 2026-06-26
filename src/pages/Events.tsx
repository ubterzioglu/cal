import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/data/events";
import { Link } from "react-router-dom";
import Seo from "@/seo/Seo";
import { breadcrumbSchema, collectionPageSchema } from "@/seo/jsonLd";

const Events = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const events = data ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Öğrenci Etkinlikleri"
        description="Cağaloğlu Anadolu Lisesi öğrenci etkinliklerini keşfet ve destek ol."
        path="/etkinlikler"
        jsonLd={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Öğrenci Etkinlikleri", path: "/etkinlikler" },
          ]),
          collectionPageSchema("Öğrenci Etkinlikleri", "/etkinlikler"),
        ]}
      />
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Öğrenci Etkinlikleri</h1>
              <p className="text-muted-foreground text-lg">
                Cağaloğlu Anadolu Lisesi öğrenci etkinliklerini keşfet.
              </p>
            </div>

            {isLoading && (
              <div className="text-center text-muted-foreground">Öğrenci etkinlikleri yükleniyor...</div>
            )}
            {isError && (
              <div className="text-center text-destructive">Öğrenci etkinlikleri yüklenemedi.</div>
            )}

            {!isLoading && !isError && events.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Henüz etkinlik eklenmemiş. Çok yakında burada olacak.
              </div>
            )}
            {!isLoading && !isError && events.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="aspect-[16/9] w-full bg-muted">
                      <img
                        src={
                          event.imageUrl ??
                          "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop"
                        }
                        alt={`${event.name} görseli`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle>{event.name}</CardTitle>
                        {event.supportNeeded && <Badge variant="destructive">Destek gerekiyor</Badge>}
                      </div>
                      <CardDescription>{event.shortInfo}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HandHeart size={16} />
                        <span>Gerekli Destek:</span>
                        <div className="flex flex-wrap gap-2">
                          {event.supportTypes.length > 0 ? (
                            event.supportTypes.map((type) => (
                              <Badge key={type} variant="secondary">
                                {type}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary">Belirtilmedi</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                          <Link to={`/etkinlikler/${event.slug}`}>Detay</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
