import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/data/students";

const Students = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const students = data ?? [];
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Öğrenciler</h1>
              <p className="text-muted-foreground text-lg">
                Öğrenci profilleri anonimdir; yalnızca baş harfler, mezuniyet yılı ve dönem paylaşılır.
              </p>
            </div>

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
            {!isLoading && !isError && students.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <Card key={student.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{getInitials(student.fullName)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Mezuniyet Yılı {student.graduationYear}
                      </p>
                      <p className="text-sm text-muted-foreground">Dönem: {student.graduationTerm}</p>
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
