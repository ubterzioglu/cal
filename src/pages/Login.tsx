import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!supabase) {
      setError("Supabase yapılandırması eksik.");
      return;
    }

    setIsLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      setIsLoading(false);

      if (signUpError) {
        setError("Kayıt başarısız. Bilgileri kontrol et.");
        return;
      }

      // Anlık giriş modunda (e-posta doğrulaması kapalı) signUp oturum açar.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate(redirectTo, { replace: true });
      } else {
        setInfo("Kayıt alındı. Giriş yapabilirsin.");
        setMode("signin");
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (signInError) {
      setError("Giriş başarısız. Bilgileri kontrol et.");
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  const handleGoogle = async () => {
    setError(null);
    setInfo(null);

    if (!supabase) {
      setError("Supabase yapılandırması eksik.");
      return;
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    });

    if (oauthError) {
      setError("Google ile giriş başlatılamadı.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "signin" ? "Üye Girişi" : "Ücretsiz Üyelik"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signin"
                ? "Devam etmek için giriş yap."
                : "Ücretsiz hesap oluştur, topluluğa katıl."}
            </p>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Google ile devam et
          </Button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase text-muted-foreground">veya e-posta ile</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-emerald-600">{info}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? mode === "signin"
                  ? "Giriş yapılıyor..."
                  : "Kayıt yapılıyor..."
                : mode === "signin"
                  ? "Giriş Yap"
                  : "Kayıt Ol"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Hesabın yok mu?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setInfo(null);
                  }}
                >
                  Ücretsiz üye ol
                </button>
              </>
            ) : (
              <>
                Zaten üye misin?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setInfo(null);
                  }}
                >
                  Giriş yap
                </button>
              </>
            )}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
