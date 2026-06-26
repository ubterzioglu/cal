import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createStudentProfile } from "@/data/students";

const StudentCreate = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [graduationTerm, setGraduationTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Ad Soyad zorunludur.");
      return;
    }

    const parsedYear = Number(graduationYear);
    if (!Number.isInteger(parsedYear) || parsedYear < 1990 || parsedYear > 2030 || parsedYear === 2010) {
      setError("Mezuniyet yılı 1990–2030 aralığında olmalı (2010 hariç).");
      return;
    }

    if (!graduationTerm.trim()) {
      setError("Dönem zorunludur.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createStudentProfile({
        fullName: fullName.trim(),
        graduationYear: parsedYear,
        graduationTerm: graduationTerm.trim(),
      });

      if (created) {
        navigate(`/students/${created.id}`);
      }
    } catch (submitError) {
      console.error(submitError);
      setError("Profil oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Öğrenci Profili Oluştur</h1>
            <p className="text-muted-foreground">
              Öğrenci profilleri anonimdir; herkese yalnızca baş harfler, mezuniyet yılı ve dönem
              gösterilir.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Soyad *</label>
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mezuniyet Yılı *</label>
              <Input
                type="number"
                placeholder="Örn. 2024"
                value={graduationYear}
                onChange={(event) => setGraduationYear(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dönem *</label>
              <Input
                placeholder="Örn. Haziran"
                value={graduationTerm}
                onChange={(event) => setGraduationTerm(event.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Profil Oluştur"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentCreate;
