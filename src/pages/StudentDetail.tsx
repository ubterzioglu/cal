import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentById } from "@/data/students";
import { Link, useParams } from "react-router-dom";
import Seo from "@/seo/Seo";

const StudentDetail = () => {
  const { id } = useParams();
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudentById(id ?? ""),
    enabled: Boolean(id),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Öğrenci Profili"
        description="Cağaloğlu Anadolu Lisesi öğrenci profili detayı."
        path={`/students/${id ?? ""}`}
        noindex
      />
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="container">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/students">
                <ArrowLeft />
                Öğrencilere dön
              </Link>
            </Button>

            {isLoading && (
              <div className="text-center text-muted-foreground">Öğrenci profili yükleniyor...</div>
            )}

            {isError && (
              <div className="text-center text-destructive">Öğrenci profili alınamadı.</div>
            )}

            {!isLoading && !isError && data && (
              <div className="max-w-xl space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {getInitials(data.fullName)}
                  </h1>
                  <p className="text-muted-foreground">
                    Bu profil anonimdir; yalnızca baş harfler, mezuniyet yılı ve dönem paylaşılır.
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border p-6">
                  <p className="text-sm text-muted-foreground">
                    Mezuniyet Yılı: {data.graduationYear}
                  </p>
                  <p className="text-sm text-muted-foreground">Dönem: {data.graduationTerm}</p>
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

export default StudentDetail;
