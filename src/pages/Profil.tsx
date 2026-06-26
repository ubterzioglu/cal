import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";
import { fetchMyStudentProfile, upsertMyStudentProfile } from "@/data/students";
import { fetchMyAlumniProfile, upsertMyAlumniProfile } from "@/data/alumni";

type Role = "ogrenci" | "mezun";

const isValidStudentYear = (year: number) =>
  Number.isInteger(year) && year >= 1990 && year <= 2030 && year !== 2010;

const Profil = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [role, setRole] = useState<Role>("mezun");
  const [fullName, setFullName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [graduationTerm, setGraduationTerm] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Load session + any existing profile (student takes priority if present).
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    let active = true;

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const id = sessionData.session?.user.id ?? null;
      if (!active) return;

      setUserId(id);
      if (!id) {
        setReady(true);
        return;
      }

      const [studentProfile, alumniProfile] = await Promise.all([
        fetchMyStudentProfile(id),
        fetchMyAlumniProfile(id),
      ]);
      if (!active) return;

      if (studentProfile) {
        setRole("ogrenci");
        setFullName(studentProfile.fullName);
        setGraduationYear(String(studentProfile.graduationYear));
        setGraduationTerm(studentProfile.graduationTerm);
        setWhatsappNumber(studentProfile.whatsappNumber ?? "");
        setLinkedinUrl(studentProfile.linkedinUrl ?? "");
        setInstagramUrl(studentProfile.instagramUrl ?? "");
        setShortBio(studentProfile.shortBio ?? "");
        setIsPublic(!studentProfile.isAnonymous);
      } else if (alumniProfile) {
        setRole("mezun");
        setFullName(alumniProfile.fullName);
        setGraduationYear(String(alumniProfile.graduationYear));
        setWhatsappNumber(alumniProfile.whatsappNumber ?? "");
        setLinkedinUrl(alumniProfile.linkedinUrl ?? "");
        setInstagramUrl(alumniProfile.instagramUrl ?? "");
        setShortBio(alumniProfile.shortBio ?? "");
        setIsPublic(!alumniProfile.isAnonymous);
      }

      setReady(true);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!userId) {
      setError("Oturum bulunamadı. Lütfen tekrar giriş yap.");
      return;
    }

    if (!fullName.trim()) {
      setError("Ad Soyad zorunludur.");
      return;
    }

    const parsedYear = Number(graduationYear);

    if (role === "ogrenci" && !isValidStudentYear(parsedYear)) {
      setError("Mezuniyet yılı 1990–2030 aralığında olmalı (2010 hariç).");
      return;
    }
    if (role === "mezun" && (!Number.isInteger(parsedYear) || parsedYear <= 1900 || parsedYear >= 2100)) {
      setError("Mezuniyet yılı geçerli bir sayı olmalıdır.");
      return;
    }

    if (role === "ogrenci" && !graduationTerm.trim()) {
      setError("Dönem zorunludur.");
      return;
    }

    if (!whatsappNumber.trim()) {
      setError("WhatsApp numarası zorunludur.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (role === "ogrenci") {
        await upsertMyStudentProfile(userId, {
          fullName: fullName.trim(),
          graduationYear: parsedYear,
          graduationTerm: graduationTerm.trim(),
          whatsappNumber: whatsappNumber.trim(),
          linkedinUrl: linkedinUrl.trim() || null,
          instagramUrl: instagramUrl.trim() || null,
          shortBio: shortBio.trim() || null,
          isAnonymous: !isPublic,
        });
      } else {
        await upsertMyAlumniProfile(userId, {
          fullName: fullName.trim(),
          graduationYear: parsedYear,
          whatsappNumber: whatsappNumber.trim(),
          linkedinUrl: linkedinUrl.trim() || null,
          instagramUrl: instagramUrl.trim() || null,
          shortBio: shortBio.trim() || null,
          isAnonymous: !isPublic,
        });
      }

      setInfo("Profilin kaydedildi.");
      navigate(role === "ogrenci" ? "/students" : "/alumni", { replace: true });
    } catch (submitError) {
      console.error(submitError);
      setError("Profil kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container text-center text-muted-foreground">Profil yükleniyor...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-2xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Profilini Tamamla</h1>
            <p className="text-muted-foreground">
              Topluluğa katılmak için profilini doldur. Bilgilerinin herkese açık görünüp
              görünmeyeceğini sen seçersin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Üyelik Türü *</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as Role)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="ogrenci" id="role-student" />
                  <Label htmlFor="role-student">Öğrenci</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="mezun" id="role-alumni" />
                  <Label htmlFor="role-alumni">Mezun</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Mezuniyet Yılı *</Label>
              <Input
                id="graduationYear"
                type="number"
                placeholder="Örn. 2024"
                value={graduationYear}
                onChange={(event) => setGraduationYear(event.target.value)}
              />
            </div>

            {role === "ogrenci" && (
              <div className="space-y-2">
                <Label htmlFor="graduationTerm">Dönem *</Label>
                <Input
                  id="graduationTerm"
                  placeholder="Örn. Haziran"
                  value={graduationTerm}
                  onChange={(event) => setGraduationTerm(event.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Numarası *</Label>
              <Input
                id="whatsapp"
                placeholder="+90 5xx xxx xx xx"
                value={whatsappNumber}
                onChange={(event) => setWhatsappNumber(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (opsiyonel)</Label>
              <Input
                id="linkedin"
                placeholder="https://www.linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(event) => setLinkedinUrl(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram (opsiyonel)</Label>
              <Input
                id="instagram"
                placeholder="https://www.instagram.com/..."
                value={instagramUrl}
                onChange={(event) => setInstagramUrl(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortBio">Kısa Bilgi (opsiyonel)</Label>
              <Textarea
                id="shortBio"
                rows={4}
                value={shortBio}
                onChange={(event) => setShortBio(event.target.value)}
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border px-4 py-3">
              <div>
                <div className="font-medium">Profilim herkese açık görünsün</div>
                <div className="text-sm text-muted-foreground">
                  Kapalıysa adın baş harflerle gösterilir, iletişim bilgilerin gizli kalır.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                    isPublic
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  Açık
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                    !isPublic
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  Gizli
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-emerald-600">{info}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Profili Kaydet"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profil;
