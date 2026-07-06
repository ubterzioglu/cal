import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, ArrowLeft, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAlumniById } from "@/data/alumni";
import { Link, useParams } from "react-router-dom";
import Seo from "@/seo/Seo";

const AlumniDetail = () => {
  const { id } = useParams();
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["alumni", id],
    queryFn: () => fetchAlumniById(id ?? ""),
    enabled: Boolean(id),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Mezun Profili"
        description="Cağaloğlu Anadolu Lisesi mezun profili detayı."
        path={`/alumni/${id ?? ""}`}
        noindex
      />
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="container">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/alumni">
                <ArrowLeft />
                Mezunlara dön
              </Link>
            </Button>

            {isLoading && (
              <div className="text-center text-muted-foreground">Mezun profili yükleniyor...</div>
            )}

            {isError && (
              <div className="text-center text-destructive">Mezun profili alınamadı.</div>
            )}

            {!isLoading && !isError && data && (
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {data.isAnonymous ? getInitials(data.fullName) : data.fullName}
                    </h1>
                    <p className="text-muted-foreground">Mezuniyet Yılı: {data.graduationYear}</p>
                  </div>

                  {!data.isAnonymous && (
                    <>
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Kısa Bilgi</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {data.shortBio || "Henüz kısa bilgi eklenmedi."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Destek Olabileceği Konular</h2>
                        {data.supportTopics.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {data.supportTopics.map((topic) => (
                              <Badge key={topic} variant="secondary">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Henüz destek konusu eklenmedi.</p>
                        )}
                      </div>
                    </>
                  )}

                  {data.isAnonymous && (
                    <p className="text-muted-foreground">
                      Bu mezun anonim kalmayı tercih etti. Diğer bilgiler paylaşılmamaktadır.
                    </p>
                  )}
                </div>

                {!data.isAnonymous && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">İletişim</h3>
                    <div className="flex w-[310px] max-w-full flex-col gap-3 sm:w-[310px]">
                      {data.linkedinUrl && (
                        <Button asChild variant="outline" className="w-full">
                          <a href={data.linkedinUrl} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {data.instagramUrl && (
                        <Button asChild variant="outline" className="w-full">
                          <a href={data.instagramUrl} target="_blank" rel="noreferrer">
                            <ExternalLink />
                            Instagram
                          </a>
                        </Button>
                      )}
                      {data.whatsappNumber && (
                        <Button asChild variant="outline" className="w-full">
                          <a
                            href={`https://wa.me/${data.whatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Phone />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                      {data.email && (
                        <Button asChild variant="secondary" className="w-full">
                          <a href={`mailto:${data.email}`}>
                            <Mail />
                            {data.email}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniDetail;
