import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HandHeart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchClubs } from "@/data/clubs";
import { Link } from "react-router-dom";
import Seo from "@/seo/Seo";

const Clubs = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
  const [search, setSearch] = useState("");

  const clubs = data ?? [];

  const filteredClubs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    if (!query) return clubs;
    return clubs.filter(
      (club) =>
        club.name.toLocaleLowerCase("tr-TR").includes(query) ||
        club.shortInfo.toLocaleLowerCase("tr-TR").includes(query),
    );
  }, [clubs, search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Öğrenci Kulüpleri"
        description="Cağaloğlu Anadolu Lisesi öğrenci kulüplerini keşfet ve destek ol."
        path="/clubs"
        noindex
      />
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Öğrenci Kulüpleri</h1>
              <p className="text-muted-foreground text-lg">
                Cağaloğlu Anadolu Lisesi öğrenci kulüplerini keşfet.
              </p>
            </div>

            {!isLoading && !isError && clubs.length > 0 && (
              <div className="mx-auto mb-8 max-w-md">
                <Input
                  type="search"
                  placeholder="Kulüp ara..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            )}

            {isLoading && (
              <div className="text-center text-muted-foreground">Öğrenci kulüpleri yükleniyor...</div>
            )}
            {isError && (
              <div className="text-center text-destructive">Öğrenci kulüpleri yüklenemedi.</div>
            )}

            {!isLoading && !isError && clubs.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Henüz kulüp eklenmemiş. Çok yakında burada olacak.
              </div>
            )}
            {!isLoading && !isError && clubs.length > 0 && filteredClubs.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Aramanla eşleşen kulüp bulunamadı.
              </div>
            )}
            {!isLoading && !isError && filteredClubs.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClubs.map((club) => (
                <Card key={club.id} className="overflow-hidden">
                  <div className="aspect-[16/9] w-full bg-muted">
                    <img
                      src={club.imageUrl ?? "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"}
                      alt={`${club.name} görseli`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle>{club.name}</CardTitle>
                      {club.supportNeeded && (
                        <Badge variant="destructive">Destek gerekiyor</Badge>
                      )}
                    </div>
                    <CardDescription>{club.shortInfo}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HandHeart size={16} />
                      <span>Gerekli Destek:</span>
                      <div className="flex flex-wrap gap-2">
                        {club.supportTypes.length > 0 ? (
                          club.supportTypes.map((type) => (
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
                      <Link to={`/clubs/${club.slug}`}>
                        Detay
                      </Link>
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

export default Clubs;
