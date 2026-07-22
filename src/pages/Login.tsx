import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Seo from "@/seo/Seo";
import { ShieldCheck } from "lucide-react";

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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Seo title="Giriş Yap" description="CAL Community'e giriş yap." path="/login" noindex />

      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Visual panel */}
        <div className="relative hidden w-1/2 overflow-hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(352,75%,18%)] via-[hsl(352,75%,10%)] to-black" />
          <div className="ember-field absolute inset-0" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} className="ember" style={{ "--i": index } as React.CSSProperties} />
            ))}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(143,22,39,0.35),transparent_60%)]" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CAL Community logo"
                className="h-10 w-10 rounded-full object-contain ring-2 ring-white/20"
              />
              <span className="font-semibold">CAL Community</span>
            </Link>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Cağaloğlu Anadolu Lisesi
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight">
                Topluluğa katıl,
                <br />
                bağlarını güçlendir.
              </h2>
              <p className="max-w-sm text-sm text-white/60">
                Kulüpler, etkinlikler, takımlar ve mezun dayanışması — hepsi tek bir çatı altında.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="h-4 w-4" />
              Bilgilerin güvenle saklanır, seçtiğin görünürlük ayarına göre paylaşılır.
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full space-y-8 p-8 md:w-1/2 md:p-12">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "signin" ? "Üye Girişi" : "Ücretsiz Üyelik"}
            </h1>
            <p className="text-sm text-muted-foreground">
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
      </div>
    </div>
  );
};

export default Login;
