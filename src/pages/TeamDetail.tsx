import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, ArrowLeft, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamBySlug } from "@/data/teams";
import { Link, useParams } from "react-router-dom";
import ClaimButton from "@/components/claim/ClaimButton";

const TeamDetail = () => {
  const { slug } = useParams();
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["team", slug],
    queryFn: () => fetchTeamBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="container">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/takimlar">
                <ArrowLeft />
                Öğrenci takımlarına dön
              </Link>
            </Button>

            {isLoading && (
              <div className="text-center text-muted-foreground">Takım bilgisi yükleniyor...</div>
            )}

            {isError && (
              <div className="text-center text-destructive">Takım bilgisi alınamadı.</div>
            )}

            {!isLoading && !isError && data && (
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
                    <img
                      src={
                        data.imageUrl ??
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
                      }
                      alt={`${data.name} görseli`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{data.name}</h1>
                    <p className="text-lg text-muted-foreground">{data.shortInfo}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-muted-foreground">Takımın Desteğe İhtiyacı var mı?</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md border px-2 py-1 text-xs font-medium ${
                            data.supportNeeded
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-white/10 bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          Var
                        </span>
                        <span
                          className={`rounded-md border px-2 py-1 text-xs font-medium ${
                            !data.supportNeeded
                              ? "border-rose-500 bg-rose-500 text-white"
                              : "border-white/10 bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          Yok
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-muted-foreground">Gerekli Destek:</span>
                      <div className="flex items-center gap-2">
                        {(["Maddi", "Manevi"] as const).map((type) => {
                          const active = data.supportTypes.includes(type);
                          return (
                            <span
                              key={type}
                              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                                active
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-white/10 bg-muted/40 text-muted-foreground"
                              }`}
                            >
                              {type}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {data.supportTypes.includes("Maddi") && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Maddi destek açıklaması</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>{data.financialSupportInfo || "Hesap Bilgileri"}</div>
                          <div>{data.financialSupportIban || "IBAN numarası"}</div>
                          <div>{data.financialSupportBankName || "Banka İsmi"}</div>
                          <div>{data.financialSupportDescription || "Açıklama"}</div>
                        </div>
                      </div>
                    )}
                    {data.supportTypes.includes("Manevi") && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Manevi destek açıklaması</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {data.moralSupportText || "Buraya kullanıcı madde madde yazabilir veya paragraf yazabilir."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Uzun Bilgi</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {data.longInfo || "Henüz uzun bilgi eklenmedi."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">İletişim</h3>
                    <div className="flex flex-col gap-3">
                      {data.websiteUrl && (
                        <Button asChild variant="outline">
                          <a href={data.websiteUrl} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            Web Sayfası
                          </a>
                        </Button>
                      )}
                      {data.contactEmail && (
                        <Button asChild variant="secondary">
                          <a href={`mailto:${data.contactEmail}`}>
                            <Mail />
                            {data.contactEmail}
                          </a>
                        </Button>
                      )}
                      {!data.websiteUrl && !data.contactEmail && (
                        <p className="text-sm text-muted-foreground">Henüz iletişim bilgisi eklenmedi.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Sorumlu Kişiler</h3>
                    {data.responsiblePeople.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.responsiblePeople.map((person) => (
                          <Badge key={person} variant="secondary" className="gap-2">
                            <Users size={14} />
                            {getInitials(person)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Henüz sorumlu kişi eklenmedi.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6 rounded-lg border p-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Gelişmeler</h2>
                    {data.developments.length > 0 ? (
                      <ul className="space-y-2 text-muted-foreground">
                        {data.developments.map((item, index) => (
                          <li key={`${item}-${index}`} className="whitespace-pre-line">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Henüz gelişme eklenmedi.</p>
                    )}
                  </div>

                  <ClaimButton entityType="team" entityId={data.id} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamDetail;
