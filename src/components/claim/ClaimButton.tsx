import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import {
  fetchMyClaimRequest,
  submitClaimRequest,
  type ClaimEntityType,
  type ClaimRequest,
} from "@/data/claimRequests";

interface ClaimButtonProps {
  entityType: ClaimEntityType;
  entityId: string;
}

const STATUS_TEXT: Record<ClaimRequest["status"], string> = {
  pending: "Sahiplenme talebin alındı. Onay bekleniyor.",
  approved: "Sahiplenme talebin onaylandı. Admin panelinden düzenleyebilirsin.",
  rejected: "Sahiplenme talebin reddedildi.",
};

const ClaimButton = ({ entityType, entityId }: ClaimButtonProps) => {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [existing, setExisting] = useState<ClaimRequest | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSessionUserId(data.session?.user.id ?? null);
      setAuthReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUserId(session?.user.id ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sessionUserId || !entityId) {
      setExisting(null);
      return;
    }

    let active = true;
    fetchMyClaimRequest(entityType, entityId).then((request) => {
      if (active) {
        setExisting(request);
      }
    });

    return () => {
      active = false;
    };
  }, [sessionUserId, entityType, entityId]);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const created = await submitClaimRequest(entityType, entityId, note);
      if (created) {
        setExisting(created);
        setNote("");
      }
    } catch {
      setError("Sahiplenme talebi gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!supabase || !authReady) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Bu sayfayı sahiplen</h3>

      {!sessionUserId && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Bu sayfayı yönetmek için giriş yapman gerekiyor.
          </p>
          <Button asChild variant="outline">
            <Link to="/login">Sahiplenmek için giriş yap</Link>
          </Button>
        </div>
      )}

      {sessionUserId && existing && (
        <p className="text-sm text-muted-foreground">{STATUS_TEXT[existing.status]}</p>
      )}

      {sessionUserId && !existing && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Yetkili olduğunu doğrulamak için kısa bir not bırakabilirsin (ör. adın ve görevin).
            Talebin superadmin tarafından onaylandığında bu sayfayı düzenleyebileceksin.
          </p>
          <Textarea
            rows={3}
            placeholder="Örn. Kulüp başkanıyım, iletişim: ..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Sahiplenme talebi gönder"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClaimButton;
