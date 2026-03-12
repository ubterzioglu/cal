import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import type { Club } from "@/data/clubs";
import type { StudentEvent } from "@/data/events";
import type { StudentTeam } from "@/data/teams";

const SUPERADMIN_EMAIL = "ubterzioglu@gmail.com";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<StudentEvent | null>(null);
  const [teams, setTeams] = useState<StudentTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<StudentTeam | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEventSaving, setIsEventSaving] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [isTeamSaving, setIsTeamSaving] = useState(false);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [clubAdminEmail, setClubAdminEmail] = useState("");
  const [eventAdminEmail, setEventAdminEmail] = useState("");
  const [teamAdminEmail, setTeamAdminEmail] = useState("");

  const isSuperAdmin = useMemo(() => sessionEmail === SUPERADMIN_EMAIL, [sessionEmail]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !sessionEmail) return;

    const loadClubs = async () => {
      setError(null);
      setIsLoading(true);
      if (isSuperAdmin) {
        const { data, error: fetchError } = await supabase
          .from("clubs")
          .select("id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at")
          .order("name");

        if (fetchError) {
          setError("Kulüpler yüklenemedi.");
        } else {
          const mapped = (data ?? []).map((club) => ({
            id: club.id,
            slug: club.slug,
            name: club.name,
            shortInfo: club.short_info ?? "",
            longInfo: club.long_info ?? "",
            supportNeeded: club.support_needed ?? false,
            supportTypes: club.support_types ?? [],
            financialSupportInfo: club.financial_support_info ?? "",
            financialSupportBankName: club.financial_support_bank_name ?? "",
            financialSupportIban: club.financial_support_iban ?? "",
            financialSupportDescription: club.financial_support_description ?? "",
            moralSupportText: club.moral_support_text ?? "",
            imageUrl: club.image_url,
            websiteUrl: club.website_url,
            contactEmail: club.contact_email,
            responsiblePeople: club.responsible_people ?? [],
            developments: club.developments ?? [],
            createdAt: club.created_at,
          }));
          setClubs(mapped);
        }
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("club_admins")
        .select("club:clubs(id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at)")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Kulüp yetkileri alınamadı.");
        setIsLoading(false);
        return;
      }

      const mapped = (data ?? [])
        .map((item: { club: unknown }) => item.club)
        .filter(Boolean)
        .map((club) => ({
          id: club.id,
          slug: club.slug,
          name: club.name,
          shortInfo: club.short_info ?? "",
          longInfo: club.long_info ?? "",
          supportNeeded: club.support_needed ?? false,
          supportTypes: club.support_types ?? [],
          financialSupportInfo: club.financial_support_info ?? "",
          financialSupportBankName: club.financial_support_bank_name ?? "",
          financialSupportIban: club.financial_support_iban ?? "",
          financialSupportDescription: club.financial_support_description ?? "",
          moralSupportText: club.moral_support_text ?? "",
          imageUrl: club.image_url,
          websiteUrl: club.website_url,
          contactEmail: club.contact_email,
          responsiblePeople: club.responsible_people ?? [],
          developments: club.developments ?? [],
          createdAt: club.created_at,
        }));
      setClubs(mapped);
      setIsLoading(false);
    };

    loadClubs();
  }, [sessionEmail, isSuperAdmin]);

  useEffect(() => {
    if (!supabase || !sessionEmail) return;

    const loadEvents = async () => {
      setIsEventsLoading(true);
      setError(null);

      if (isSuperAdmin) {
        const { data, error: fetchError } = await supabase
          .from("student_events")
          .select("id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at")
          .order("name");

        if (fetchError) {
          setError("Etkinlikler yüklenemedi.");
          setIsEventsLoading(false);
          return;
        }

        const mapped = (data ?? []).map((event) => ({
          id: event.id,
          slug: event.slug,
          name: event.name,
          shortInfo: event.short_info ?? "",
          longInfo: event.long_info ?? "",
          supportNeeded: event.support_needed ?? false,
          supportTypes: event.support_types ?? [],
          financialSupportInfo: event.financial_support_info ?? "",
          financialSupportBankName: event.financial_support_bank_name ?? "",
          financialSupportIban: event.financial_support_iban ?? "",
          financialSupportDescription: event.financial_support_description ?? "",
          moralSupportText: event.moral_support_text ?? "",
          imageUrl: event.image_url,
          websiteUrl: event.website_url,
          contactEmail: event.contact_email,
          responsiblePeople: event.responsible_people ?? [],
          developments: event.developments ?? [],
          createdAt: event.created_at,
        }));

        setEvents(mapped);
        setIsEventsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("event_admins")
        .select("event:student_events(id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at)")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Etkinlik yetkileri alınamadı.");
        setIsEventsLoading(false);
        return;
      }

      const mapped = (data ?? [])
        .map((item: { event: unknown }) => item.event)
        .filter(Boolean)
        .map((event) => ({
          id: event.id,
          slug: event.slug,
          name: event.name,
          shortInfo: event.short_info ?? "",
          longInfo: event.long_info ?? "",
          supportNeeded: event.support_needed ?? false,
          supportTypes: event.support_types ?? [],
          financialSupportInfo: event.financial_support_info ?? "",
          financialSupportBankName: event.financial_support_bank_name ?? "",
          financialSupportIban: event.financial_support_iban ?? "",
          financialSupportDescription: event.financial_support_description ?? "",
          moralSupportText: event.moral_support_text ?? "",
          imageUrl: event.image_url,
          websiteUrl: event.website_url,
          contactEmail: event.contact_email,
          responsiblePeople: event.responsible_people ?? [],
          developments: event.developments ?? [],
          createdAt: event.created_at,
        }));

      setEvents(mapped);
      setIsEventsLoading(false);
    };

    loadEvents();
  }, [sessionEmail, isSuperAdmin]);

  useEffect(() => {
    if (!supabase || !sessionEmail) return;

    const loadTeams = async () => {
      setIsTeamsLoading(true);
      setError(null);

      if (isSuperAdmin) {
        const { data, error: fetchError } = await supabase
          .from("student_teams")
          .select("id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at")
          .order("name");

        if (fetchError) {
          setError("Takımlar yüklenemedi.");
          setIsTeamsLoading(false);
          return;
        }

        const mapped = (data ?? []).map((team) => ({
          id: team.id,
          slug: team.slug,
          name: team.name,
          shortInfo: team.short_info ?? "",
          longInfo: team.long_info ?? "",
          supportNeeded: team.support_needed ?? false,
          supportTypes: team.support_types ?? [],
          financialSupportInfo: team.financial_support_info ?? "",
          financialSupportBankName: team.financial_support_bank_name ?? "",
          financialSupportIban: team.financial_support_iban ?? "",
          financialSupportDescription: team.financial_support_description ?? "",
          moralSupportText: team.moral_support_text ?? "",
          imageUrl: team.image_url,
          websiteUrl: team.website_url,
          contactEmail: team.contact_email,
          responsiblePeople: team.responsible_people ?? [],
          developments: team.developments ?? [],
          createdAt: team.created_at,
        }));

        setTeams(mapped);
        setIsTeamsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("team_admins")
        .select("team:student_teams(id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at)")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Takım yetkileri alınamadı.");
        setIsTeamsLoading(false);
        return;
      }

      const mapped = (data ?? [])
        .map((item: { team: unknown }) => item.team)
        .filter(Boolean)
        .map((team) => ({
          id: team.id,
          slug: team.slug,
          name: team.name,
          shortInfo: team.short_info ?? "",
          longInfo: team.long_info ?? "",
          supportNeeded: team.support_needed ?? false,
          supportTypes: team.support_types ?? [],
          financialSupportInfo: team.financial_support_info ?? "",
          financialSupportBankName: team.financial_support_bank_name ?? "",
          financialSupportIban: team.financial_support_iban ?? "",
          financialSupportDescription: team.financial_support_description ?? "",
          moralSupportText: team.moral_support_text ?? "",
          imageUrl: team.image_url,
          websiteUrl: team.website_url,
          contactEmail: team.contact_email,
          responsiblePeople: team.responsible_people ?? [],
          developments: team.developments ?? [],
          createdAt: team.created_at,
        }));

      setTeams(mapped);
      setIsTeamsLoading(false);
    };

    loadTeams();
  }, [sessionEmail, isSuperAdmin]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setIsLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError("Giriş başarısız. Bilgileri kontrol et.");
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSelectedClub(null);
    setSelectedEvent(null);
    setSelectedTeam(null);
    setAdminMessage(null);
  };

  const handleUpdateClub = async () => {
    if (!supabase || !selectedClub) return;
    setIsSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("clubs")
      .update({
        name: selectedClub.name,
        short_info: selectedClub.shortInfo,
        long_info: selectedClub.longInfo,
        support_needed: selectedClub.supportNeeded,
        support_types: selectedClub.supportTypes,
        financial_support_info: selectedClub.financialSupportInfo,
        financial_support_bank_name: selectedClub.financialSupportBankName,
        financial_support_iban: selectedClub.financialSupportIban,
        financial_support_description: selectedClub.financialSupportDescription,
        moral_support_text: selectedClub.moralSupportText,
        image_url: selectedClub.imageUrl,
        website_url: selectedClub.websiteUrl,
        contact_email: selectedClub.contactEmail,
        responsible_people: selectedClub.responsiblePeople,
        developments: selectedClub.developments,
      })
      .eq("id", selectedClub.id);

    if (updateError) {
      setError("Kulüp güncellenemedi.");
    }

    setIsSaving(false);
  };

  const handleUpdateEvent = async () => {
    if (!supabase || !selectedEvent) return;
    setIsEventSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("student_events")
      .update({
        name: selectedEvent.name,
        short_info: selectedEvent.shortInfo,
        long_info: selectedEvent.longInfo,
        support_needed: selectedEvent.supportNeeded,
        support_types: selectedEvent.supportTypes,
        financial_support_info: selectedEvent.financialSupportInfo,
        financial_support_bank_name: selectedEvent.financialSupportBankName,
        financial_support_iban: selectedEvent.financialSupportIban,
        financial_support_description: selectedEvent.financialSupportDescription,
        moral_support_text: selectedEvent.moralSupportText,
        image_url: selectedEvent.imageUrl,
        website_url: selectedEvent.websiteUrl,
        contact_email: selectedEvent.contactEmail,
        responsible_people: selectedEvent.responsiblePeople,
        developments: selectedEvent.developments,
      })
      .eq("id", selectedEvent.id);

    if (updateError) {
      setError("Etkinlik güncellenemedi.");
    }

    setIsEventSaving(false);
  };

  const handleUpdateTeam = async () => {
    if (!supabase || !selectedTeam) return;
    setIsTeamSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("student_teams")
      .update({
        name: selectedTeam.name,
        short_info: selectedTeam.shortInfo,
        long_info: selectedTeam.longInfo,
        support_needed: selectedTeam.supportNeeded,
        support_types: selectedTeam.supportTypes,
        financial_support_info: selectedTeam.financialSupportInfo,
        financial_support_bank_name: selectedTeam.financialSupportBankName,
        financial_support_iban: selectedTeam.financialSupportIban,
        financial_support_description: selectedTeam.financialSupportDescription,
        moral_support_text: selectedTeam.moralSupportText,
        image_url: selectedTeam.imageUrl,
        website_url: selectedTeam.websiteUrl,
        contact_email: selectedTeam.contactEmail,
        responsible_people: selectedTeam.responsiblePeople,
        developments: selectedTeam.developments,
      })
      .eq("id", selectedTeam.id);

    if (updateError) {
      setError("Takım güncellenemedi.");
    }

    setIsTeamSaving(false);
  };

  const handleAssignClubAdmin = async () => {
    if (!supabase || !selectedClub || !clubAdminEmail.trim()) return;
    setError(null);
    setAdminMessage(null);

    const { error: assignError } = await supabase.rpc("assign_club_admin", {
      target_email: clubAdminEmail.trim(),
      target_club_id: selectedClub.id,
    });

    if (assignError) {
      setError("Kulüp admini atanamadı.");
      return;
    }

    setAdminMessage("Kulüp admini atandı.");
    setClubAdminEmail("");
  };

  const handleAssignEventAdmin = async () => {
    if (!supabase || !selectedEvent || !eventAdminEmail.trim()) return;
    setError(null);
    setAdminMessage(null);

    const { error: assignError } = await supabase.rpc("assign_event_admin", {
      target_email: eventAdminEmail.trim(),
      target_event_id: selectedEvent.id,
    });

    if (assignError) {
      setError("Etkinlik admini atanamadı.");
      return;
    }

    setAdminMessage("Etkinlik admini atandı.");
    setEventAdminEmail("");
  };

  const handleAssignTeamAdmin = async () => {
    if (!supabase || !selectedTeam || !teamAdminEmail.trim()) return;
    setError(null);
    setAdminMessage(null);

    const { error: assignError } = await supabase.rpc("assign_team_admin", {
      target_email: teamAdminEmail.trim(),
      target_team_id: selectedTeam.id,
    });

    if (assignError) {
      setError("Takım admini atanamadı.");
      return;
    }

    setAdminMessage("Takım admini atandı.");
    setTeamAdminEmail("");
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setPasswordMessage(null);
    setError(null);

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError("Şifre güncellenemedi.");
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Şifre güncellendi.");
  };

  const updateSelectedClub = (patch: Partial<Club>) => {
    setSelectedClub((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateSelectedEvent = (patch: Partial<StudentEvent>) => {
    setSelectedEvent((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateSelectedTeam = (patch: Partial<StudentTeam>) => {
    setSelectedTeam((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mb-10 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Kulüp Yönetimi</h1>
            <p className="text-muted-foreground">
              {sessionEmail ? "Kulüp bilgilerini düzenleyebilirsin." : "Panel için giriş yap."}
            </p>
          </div>

          {!supabase && (
            <Card>
              <CardHeader>
                <CardTitle>Supabase yapılandırması eksik</CardTitle>
                <CardDescription>.env içindeki VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY kontrol et.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {adminMessage && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {adminMessage}
            </div>
          )}

          {!sessionEmail && supabase && (
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle>Giriş</CardTitle>
                <CardDescription>Yetkili kulüp hesabı ile giriş yap.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSignIn}>
                  <Input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {sessionEmail && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Kulüpler</CardTitle>
                  <CardDescription>
                    {isSuperAdmin ? "Tüm kulüpler" : "Yetkili olduğun kulüpler"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading && <div className="text-sm text-muted-foreground">Yükleniyor...</div>}
                  {!isLoading && clubs.length === 0 && (
                    <div className="text-sm text-muted-foreground">Henüz yetkili kulüp bulunamadı.</div>
                  )}
                  <div className="space-y-3">
                    {clubs.map((club) => (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => setSelectedClub(club)}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                          selectedClub?.id === club.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/40"
                        }`}
                      >
                        <div className="font-medium">{club.name}</div>
                        <div className="text-sm text-muted-foreground">{club.shortInfo || "Kısa bilgi yok"}</div>
                      </button>
                    ))}
                  </div>
                  {isSuperAdmin && selectedClub && (
                    <div className="space-y-2">
                      <Input
                        value={clubAdminEmail}
                        onChange={(event) => setClubAdminEmail(event.target.value)}
                        placeholder="Kulüp admin e-postası"
                        type="email"
                      />
                      <Button variant="secondary" onClick={handleAssignClubAdmin}>
                        Kulüp Admin Ata
                      </Button>
                    </div>
                  )}
                  <Button variant="secondary" onClick={handleSignOut}>
                    Çıkış yap
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kulüp Düzenle</CardTitle>
                  <CardDescription>Seçili kulübün bilgilerini güncelle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedClub && (
                    <div className="text-sm text-muted-foreground">Soldan bir kulüp seç.</div>
                  )}

                  {selectedClub && (
                    <div className="space-y-4">
                      <Input
                        value={selectedClub.name}
                        onChange={(event) => updateSelectedClub({ name: event.target.value })}
                        placeholder="Kulüp adı"
                      />
                      <Input
                        value={selectedClub.imageUrl ?? ""}
                        onChange={(event) => updateSelectedClub({ imageUrl: event.target.value || null })}
                        placeholder="Görsel URL"
                      />
                      <Input
                        value={selectedClub.websiteUrl ?? ""}
                        onChange={(event) => updateSelectedClub({ websiteUrl: event.target.value || null })}
                        placeholder="Website URL"
                      />
                      <Input
                        value={selectedClub.contactEmail ?? ""}
                        onChange={(event) => updateSelectedClub({ contactEmail: event.target.value || null })}
                        placeholder="İletişim e-postası"
                        type="email"
                      />
                      <Input
                        value={selectedClub.responsiblePeople.join(", ")}
                        onChange={(event) =>
                          updateSelectedClub({
                            responsiblePeople: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Sorumlu kişiler (virgülle ayır)"
                      />
                      <Textarea
                        value={selectedClub.shortInfo}
                        onChange={(event) => updateSelectedClub({ shortInfo: event.target.value })}
                        placeholder="Kısa bilgi"
                        rows={3}
                      />
                      <Textarea
                        value={selectedClub.longInfo}
                        onChange={(event) => updateSelectedClub({ longInfo: event.target.value })}
                        placeholder="Uzun bilgi"
                        rows={6}
                      />
                      <Textarea
                        value={selectedClub.developments.join("\n")}
                        onChange={(event) =>
                          updateSelectedClub({
                            developments: event.target.value
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Gelişmeler (her satır ayrı madde, 01.02.26 formatında tarih ile başlat)"
                        rows={5}
                      />
                      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                        <div>
                          <div className="font-medium">Kulübün Desteğe İhtiyacı var mı?</div>
                          <div className="text-sm text-muted-foreground">Var / Yok seçimini yap.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateSelectedClub({ supportNeeded: true })}
                            className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                              selectedClub.supportNeeded
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            Var
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSelectedClub({ supportNeeded: false })}
                            className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                              !selectedClub.supportNeeded
                                ? "border-rose-500 bg-rose-500 text-white"
                                : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            Yok
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                        <div>
                          <div className="font-medium">Gerekli Destek</div>
                          <div className="text-sm text-muted-foreground">Maddi / Manevi seçimini yap.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(["Maddi", "Manevi"] as const).map((type) => {
                            const active = selectedClub.supportTypes.includes(type);
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  updateSelectedClub({
                                    supportTypes: active
                                      ? selectedClub.supportTypes.filter((item) => item !== type)
                                      : [...selectedClub.supportTypes, type],
                                  })
                                }
                                className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                                  active
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Maddi destek açıklaması</div>
                        <Input
                          value={selectedClub.financialSupportInfo}
                          onChange={(event) => updateSelectedClub({ financialSupportInfo: event.target.value })}
                          placeholder="Hesap Bilgileri"
                        />
                        <Input
                          value={selectedClub.financialSupportIban}
                          onChange={(event) => updateSelectedClub({ financialSupportIban: event.target.value })}
                          placeholder="IBAN numarası"
                        />
                        <Input
                          value={selectedClub.financialSupportBankName}
                          onChange={(event) => updateSelectedClub({ financialSupportBankName: event.target.value })}
                          placeholder="Banka İsmi"
                        />
                        <Input
                          value={selectedClub.financialSupportDescription}
                          onChange={(event) => updateSelectedClub({ financialSupportDescription: event.target.value })}
                          placeholder="Açıklama"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Manevi destek açıklaması</div>
                        <Textarea
                          value={selectedClub.moralSupportText}
                          onChange={(event) => updateSelectedClub({ moralSupportText: event.target.value })}
                          placeholder="Buraya kullanıcı madde madde yazacak veya paragraf yazacak"
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateClub} disabled={isSaving}>
                        {isSaving ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Öğrenci Etkinlikleri</CardTitle>
                  <CardDescription>
                    {isSuperAdmin ? "Tüm etkinlikler" : "Yetkili olduğun etkinlikler"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEventsLoading && (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                  )}
                  {!isEventsLoading && events.length === 0 && (
                    <div className="text-sm text-muted-foreground">Henüz etkinlik bulunamadı.</div>
                  )}
                  <div className="space-y-3">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                          selectedEvent?.id === event.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/40"
                        }`}
                      >
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.shortInfo || "Kısa bilgi yok"}
                        </div>
                      </button>
                    ))}
                  </div>
                  {isSuperAdmin && selectedEvent && (
                    <div className="space-y-2">
                      <Input
                        value={eventAdminEmail}
                        onChange={(event) => setEventAdminEmail(event.target.value)}
                        placeholder="Etkinlik admin e-postası"
                        type="email"
                      />
                      <Button variant="secondary" onClick={handleAssignEventAdmin}>
                        Etkinlik Admin Ata
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Etkinlik Düzenle</CardTitle>
                  <CardDescription>Seçili etkinliğin bilgilerini güncelle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedEvent && (
                    <div className="text-sm text-muted-foreground">Soldan bir etkinlik seç.</div>
                  )}

                  {selectedEvent && (
                    <div className="space-y-4">
                      <Input
                        value={selectedEvent.name}
                        onChange={(event) => updateSelectedEvent({ name: event.target.value })}
                        placeholder="Etkinlik adı"
                      />
                      <Input
                        value={selectedEvent.imageUrl ?? ""}
                        onChange={(event) => updateSelectedEvent({ imageUrl: event.target.value || null })}
                        placeholder="Görsel URL"
                      />
                      <Input
                        value={selectedEvent.websiteUrl ?? ""}
                        onChange={(event) => updateSelectedEvent({ websiteUrl: event.target.value || null })}
                        placeholder="Website URL"
                      />
                      <Input
                        value={selectedEvent.contactEmail ?? ""}
                        onChange={(event) => updateSelectedEvent({ contactEmail: event.target.value || null })}
                        placeholder="İletişim e-postası"
                        type="email"
                      />
                      <Input
                        value={selectedEvent.responsiblePeople.join(", ")}
                        onChange={(event) =>
                          updateSelectedEvent({
                            responsiblePeople: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Sorumlu kişiler (virgülle ayır)"
                      />
                      <Textarea
                        value={selectedEvent.shortInfo}
                        onChange={(event) => updateSelectedEvent({ shortInfo: event.target.value })}
                        placeholder="Kısa bilgi"
                        rows={3}
                      />
                      <Textarea
                        value={selectedEvent.longInfo}
                        onChange={(event) => updateSelectedEvent({ longInfo: event.target.value })}
                        placeholder="Uzun bilgi"
                        rows={6}
                      />
                      <Textarea
                        value={selectedEvent.developments.join("\n")}
                        onChange={(event) =>
                          updateSelectedEvent({
                            developments: event.target.value
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Gelişmeler (her satır ayrı madde, 01.02.26 formatında tarih ile başlat)"
                        rows={5}
                      />
                      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                        <div>
                          <div className="font-medium">Etkinliğin Desteğe İhtiyacı var mı?</div>
                          <div className="text-sm text-muted-foreground">Var / Yok seçimini yap.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateSelectedEvent({ supportNeeded: true })}
                            className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                              selectedEvent.supportNeeded
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            Var
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSelectedEvent({ supportNeeded: false })}
                            className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                              !selectedEvent.supportNeeded
                                ? "border-rose-500 bg-rose-500 text-white"
                                : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            Yok
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                        <div>
                          <div className="font-medium">Gerekli Destek</div>
                          <div className="text-sm text-muted-foreground">Maddi / Manevi seçimini yap.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(["Maddi", "Manevi"] as const).map((type) => {
                            const active = selectedEvent.supportTypes.includes(type);
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  updateSelectedEvent({
                                    supportTypes: active
                                      ? selectedEvent.supportTypes.filter((item) => item !== type)
                                      : [...selectedEvent.supportTypes, type],
                                  })
                                }
                                className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                                  active
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Maddi destek açıklaması</div>
                        <Input
                          value={selectedEvent.financialSupportInfo}
                          onChange={(event) => updateSelectedEvent({ financialSupportInfo: event.target.value })}
                          placeholder="Hesap Bilgileri"
                        />
                        <Input
                          value={selectedEvent.financialSupportIban}
                          onChange={(event) => updateSelectedEvent({ financialSupportIban: event.target.value })}
                          placeholder="IBAN numarası"
                        />
                        <Input
                          value={selectedEvent.financialSupportBankName}
                          onChange={(event) => updateSelectedEvent({ financialSupportBankName: event.target.value })}
                          placeholder="Banka İsmi"
                        />
                        <Input
                          value={selectedEvent.financialSupportDescription}
                          onChange={(event) => updateSelectedEvent({ financialSupportDescription: event.target.value })}
                          placeholder="Açıklama"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Manevi destek açıklaması</div>
                        <Textarea
                          value={selectedEvent.moralSupportText}
                          onChange={(event) => updateSelectedEvent({ moralSupportText: event.target.value })}
                          placeholder="Buraya kullanıcı madde madde yazacak veya paragraf yazacak"
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateEvent} disabled={isEventSaving}>
                        {isEventSaving ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Öğrenci Takımları</CardTitle>
                  <CardDescription>
                    {isSuperAdmin ? "Tüm takımlar" : "Yetkili olduğun takımlar"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isTeamsLoading && (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                  )}
                  {!isTeamsLoading && teams.length === 0 && (
                    <div className="text-sm text-muted-foreground">Henüz takım bulunamadı.</div>
                  )}
                  <div className="space-y-3">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedTeam(team)}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                          selectedTeam?.id === team.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/40"
                        }`}
                      >
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {team.shortInfo || "Kısa bilgi yok"}
                        </div>
                      </button>
                    ))}
                  </div>
                  {isSuperAdmin && selectedTeam && (
                    <div className="space-y-2">
                      <Input
                        value={teamAdminEmail}
                        onChange={(event) => setTeamAdminEmail(event.target.value)}
                        placeholder="Takım admin e-postası"
                        type="email"
                      />
                      <Button variant="secondary" onClick={handleAssignTeamAdmin}>
                        Takım Admin Ata
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Takım Düzenle</CardTitle>
                  <CardDescription>Seçili takımın bilgilerini güncelle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedTeam && (
                    <div className="text-sm text-muted-foreground">Soldan bir takım seç.</div>
                  )}

                  {selectedTeam && (
                    <div className="space-y-4">
                      <Input
                        value={selectedTeam.name}
                        onChange={(event) => updateSelectedTeam({ name: event.target.value })}
                        placeholder="Takım adı"
                      />
                      <Input
                        value={selectedTeam.imageUrl ?? ""}
                        onChange={(event) => updateSelectedTeam({ imageUrl: event.target.value || null })}
                        placeholder="Görsel URL"
                      />
                      <Input
                        value={selectedTeam.websiteUrl ?? ""}
                        onChange={(event) => updateSelectedTeam({ websiteUrl: event.target.value || null })}
                        placeholder="Website URL"
                      />
                      <Input
                        value={selectedTeam.contactEmail ?? ""}
                        onChange={(event) => updateSelectedTeam({ contactEmail: event.target.value || null })}
                        placeholder="İletişim e-postası"
                        type="email"
                      />
                      <Input
                        value={selectedTeam.responsiblePeople.join(", ")}
                        onChange={(event) =>
                          updateSelectedTeam({
                            responsiblePeople: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Sorumlu kişiler (virgülle ayır)"
                      />
                      <Textarea
                        value={selectedTeam.shortInfo}
                        onChange={(event) => updateSelectedTeam({ shortInfo: event.target.value })}
                        placeholder="Kısa bilgi"
                        rows={3}
                      />
                      <Textarea
                        value={selectedTeam.longInfo}
                        onChange={(event) => updateSelectedTeam({ longInfo: event.target.value })}
                        placeholder="Uzun bilgi"
                        rows={6}
                      />
                      <Textarea
                        value={selectedTeam.developments.join("\n")}
                        onChange={(event) =>
                          updateSelectedTeam({
                            developments: event.target.value
                              .split("\n")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Gelişmeler (her satır ayrı madde, 01.02.26 formatında tarih ile başlat)"
                        rows={5}
                      />
                      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                        <div>
                          <div className="font-medium">Takımın Desteğe İhtiyacı var mı?</div>
                          <div className="text-sm text-muted-foreground">Var / Yok seçimini yap.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateSelectedTeam({ supportNeeded: true })}
                            className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                              selectedTeam.supportNeeded
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            Var
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSelectedTeam({ supportNeeded: false })}
                            className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                              !selectedTeam.supportNeeded
                                ? "border-rose-500 bg-rose-500 text-white"
                                : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            Yok
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
                        <div>
                          <div className="font-medium">Gerekli Destek</div>
                          <div className="text-sm text-muted-foreground">Maddi / Manevi seçimini yap.</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(["Maddi", "Manevi"] as const).map((type) => {
                            const active = selectedTeam.supportTypes.includes(type);
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  updateSelectedTeam({
                                    supportTypes: active
                                      ? selectedTeam.supportTypes.filter((item) => item !== type)
                                      : [...selectedTeam.supportTypes, type],
                                  })
                                }
                                className={`h-8 rounded-md border px-3 text-sm font-medium transition-colors ${
                                  active
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-white/10 bg-muted/40 text-muted-foreground hover:bg-muted/60"
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Maddi destek açıklaması</div>
                        <Input
                          value={selectedTeam.financialSupportInfo}
                          onChange={(event) => updateSelectedTeam({ financialSupportInfo: event.target.value })}
                          placeholder="Hesap Bilgileri"
                        />
                        <Input
                          value={selectedTeam.financialSupportIban}
                          onChange={(event) => updateSelectedTeam({ financialSupportIban: event.target.value })}
                          placeholder="IBAN numarası"
                        />
                        <Input
                          value={selectedTeam.financialSupportBankName}
                          onChange={(event) => updateSelectedTeam({ financialSupportBankName: event.target.value })}
                          placeholder="Banka İsmi"
                        />
                        <Input
                          value={selectedTeam.financialSupportDescription}
                          onChange={(event) => updateSelectedTeam({ financialSupportDescription: event.target.value })}
                          placeholder="Açıklama"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Manevi destek açıklaması</div>
                        <Textarea
                          value={selectedTeam.moralSupportText}
                          onChange={(event) => updateSelectedTeam({ moralSupportText: event.target.value })}
                          placeholder="Buraya kullanıcı madde madde yazacak veya paragraf yazacak"
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateTeam} disabled={isTeamSaving}>
                        {isTeamSaving ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Şifre Değiştir</CardTitle>
                  <CardDescription>Hesap şifreni güncelle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordMessage && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {passwordMessage}
                    </div>
                  )}
                  <form className="space-y-3" onSubmit={handlePasswordChange}>
                    <Input
                      type="password"
                      placeholder="Yeni şifre"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Yeni şifre tekrar"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                    <Button type="submit">Şifreyi güncelle</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
