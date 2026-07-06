import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/data/students";
import { Link } from "react-router-dom";
import Seo from "@/seo/Seo";

const Students = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const students = data ?? [];
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("tr");
    return students.filter((student) => {
      const matchesYear = yearFilter ? String(student.graduationYear) === yearFilter.trim() : true;
      const matchesSearch = normalizedSearch
        ? getInitials(student.fullName).toLocaleLowerCase("tr").includes(normalizedSearch) ||
          student.graduationTerm.toLocaleLowerCase("tr").includes(normalizedSearch)
        : true;
      return matchesYear && matchesSearch;
    });
  }, [students, search, yearFilter]);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Öğrenciler"
        description="Cağaloğlu Anadolu Lisesi öğrenci profilleri."
        path="/students"
        noindex
      />
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Öğrenciler</h1>
              <p className="text-muted-foreground text-lg">
                Öğrenci profilleri. Gizlilik tercihine göre yalnızca baş harfler ya da tüm bilgiler
                gösterilir.
              </p>
              <Button asChild className="mt-6">
                <Link to="/profil">Profilini Oluştur / Düzenle</Link>
              </Button>
            </div>

            {!isLoading && !isError && students.length > 0 && (
              <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Baş harf veya dönem ara"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Mezuniyet yılı"
                  value={yearFilter}
                  onChange={(event) => setYearFilter(event.target.value)}
                  className="sm:max-w-[180px]"
                />
              </div>
            )}

            {isLoading && (
              <div className="text-center text-muted-foreground">Öğrenci profilleri yükleniyor...</div>
            )}
            {isError && (
              <div className="text-center text-destructive">Öğrenci profilleri yüklenemedi.</div>
            )}

            {!isLoading && !isError && students.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Henüz öğrenci profili eklenmemiş. Çok yakında burada olacak.
              </div>
            )}
            {!isLoading && !isError && students.length > 0 && filteredStudents.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Aramanla eşleşen öğrenci profili bulunamadı.
              </div>
            )}
            {!isLoading && !isError && filteredStudents.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{getInitials(student.fullName)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Mezuniyet Yılı {student.graduationYear}
                      </p>
                      <p className="text-sm text-muted-foreground">Dönem: {student.graduationTerm}</p>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/students/${student.id}`}>Profili Gör</Link>
                      </Button>
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

export default Students;
