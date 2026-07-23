import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Seo from "@/seo/Seo";

const SifreGuncelle = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!supabase) {
      setError("Supabase yapılandırması eksik.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setIsSubmitting(false);

    if (updateError) {
      setError("Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir, tekrar deneyin.");
      return;
    }

    setInfo("Şifren güncellendi. Yönlendiriliyorsun...");
    setTimeout(() => navigate("/", { replace: true }), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Seo title="Şifre Güncelle" description="CAL Community şifreni güncelle." path="/sifre-guncelle" noindex />
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Yeni Şifre Belirle</h1>
            <p className="text-muted-foreground">Hesabın için yeni bir şifre oluştur.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-emerald-600">{info}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SifreGuncelle;
