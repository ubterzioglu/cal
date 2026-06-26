import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchAlumni } from "@/data/alumni";
import { Link } from "react-router-dom";

const Alumni = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAlumni,
  });
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const alumni = data ?? [];
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const getDisplayName = (profile: { isAnonymous: boolean; fullName: string }) =>
    profile.isAnonymous ? getInitials(profile.fullName) : profile.fullName;

  const filteredAlumni = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("tr");
    return alumni.filter((profile) => {
      const matchesYear = yearFilter ? String(profile.graduationYear) === yearFilter.trim() : true;
      const matchesSearch = normalizedSearch
        ? getDisplayName(profile).toLocaleLowerCase("tr").includes(normalizedSearch)
        : true;
      return matchesYear && matchesSearch;
    });
  }, [alumni, search, yearFilter]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Mezunlar</h1>
              <p className="text-muted-foreground text-lg">
                Mezun profilleri ve destek olabilecekleri alanlar.
              </p>
              <Button asChild className="mt-6">
                <Link to="/alumni/yeni">Mezun Profili Oluştur</Link>
              </Button>
            </div>

            {!isLoading && !isError && alumni.length > 0 && (
              <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="İsim ile ara"
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
              <div className="text-center text-muted-foreground">Mezun profilleri yükleniyor...</div>
            )}
            {isError && (
              <div className="text-center text-destructive">Mezun profilleri yüklenemedi.</div>
            )}

            {!isLoading && !isError && alumni.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Henüz mezun profili eklenmemiş. Çok yakında burada olacak.
              </div>
            )}
            {!isLoading && !isError && alumni.length > 0 && filteredAlumni.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Aramanla eşleşen mezun profili bulunamadı.
              </div>
            )}
            {!isLoading && !isError && filteredAlumni.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAlumni.map((profile) => (
                  <Card key={profile.id} className="flex flex-col overflow-hidden">
                    <CardHeader>
                      <CardTitle>{getDisplayName(profile)}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3">
                      <p className="text-sm text-muted-foreground">
                        Mezuniyet Yılı {profile.graduationYear}
                      </p>
                      {!profile.isAnonymous && profile.shortBio && (
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {profile.shortBio}
                        </p>
                      )}
                      {!profile.isAnonymous && profile.supportTopics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {profile.supportTopics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button asChild variant="outline" size="sm" className="mt-auto self-start">
                        <Link to={`/alumni/${profile.id}`}>Profili Gör</Link>
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

export default Alumni;
