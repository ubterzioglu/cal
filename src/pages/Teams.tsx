import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/data/teams";
import { Link } from "react-router-dom";

const Teams = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const teams = data ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Öğrenci Takımları</h1>
              <p className="text-muted-foreground text-lg">
                Cağaloğlu Anadolu Lisesi öğrenci takımlarını keşfet.
              </p>
            </div>

            {isLoading && (
              <div className="text-center text-muted-foreground">Öğrenci takımları yükleniyor...</div>
            )}
            {isError && (
              <div className="text-center text-destructive">Öğrenci takımları yüklenemedi.</div>
            )}

            {!isLoading && !isError && teams.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Henüz takım eklenmemiş. Çok yakında burada olacak.
              </div>
            )}
            {!isLoading && !isError && teams.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <Card key={team.id} className="overflow-hidden">
                    <div className="aspect-[16/9] w-full bg-muted">
                      <img
                        src={
                          team.imageUrl ??
                          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
                        }
                        alt={`${team.name} görseli`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle>{team.name}</CardTitle>
                        {team.supportNeeded && <Badge variant="destructive">Destek gerekiyor</Badge>}
                      </div>
                      <CardDescription>{team.shortInfo}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HandHeart size={16} />
                        <span>Gerekli Destek:</span>
                        <div className="flex flex-wrap gap-2">
                          {team.supportTypes.length > 0 ? (
                            team.supportTypes.map((type) => (
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
                          <Link to={`/takimlar/${team.slug}`}>Detay</Link>
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

export default Teams;
