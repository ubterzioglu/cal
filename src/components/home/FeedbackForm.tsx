import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquarePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { submitFeedback } from "@/data/feedback";

const MAX_MESSAGE = 2000;

const FeedbackForm = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (!supabase) {
      setIsReady(true);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setIsAuthed(Boolean(data.session));
      setIsReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsAuthed(Boolean(session));
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      await submitFeedback(trimmed);
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <section className="py-20 bg-black">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <MessageSquarePlus size={24} />
              </div>
              <CardTitle>Ek Özellik Öner, Geri Bildirim Ver</CardTitle>
              <CardDescription>
                Eksik bir şey mi var, aklına bir fikir mi geldi? Bize yaz, doğrudan bize ulaşır.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isAuthed && (
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Geri bildirim gönderebilmek için giriş yapman gerekiyor.</p>
                  <Button asChild size="sm">
                    <Link to="/login">Giriş Yap</Link>
                  </Button>
                </div>
              )}

              {isAuthed && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Ne eklemek/değiştirmek istersin?"
                    maxLength={MAX_MESSAGE}
                    rows={5}
                    required
                  />
                  <div className="flex items-center justify-between gap-3">
                    <Button type="submit" disabled={isSubmitting || !message.trim()}>
                      {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                    {status === "success" && (
                      <span className="text-sm text-emerald-500">Teşekkürler, ulaştı!</span>
                    )}
                    {status === "error" && (
                      <span className="text-sm text-destructive">Gönderilemedi, tekrar dene.</span>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
