import { supabase } from "@/lib/supabase";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  displayOrder: number;
  createdAt: string;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
};

export type AdminAnnouncement = Announcement & {
  isActive: boolean;
};

export type AdminAnnouncementRow = AnnouncementRow & {
  is_active: boolean;
};

export type AnnouncementInput = {
  title: string;
  body: string;
  imageUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
};

const PUBLIC_COLUMNS = "id, title, body, image_url, display_order, created_at";
const ADMIN_COLUMNS = "id, title, body, image_url, display_order, is_active, created_at";

const mapAnnouncement = (row: AnnouncementRow): Announcement => ({
  id: row.id,
  title: row.title,
  body: row.body,
  imageUrl: row.image_url,
  displayOrder: row.display_order,
  createdAt: row.created_at,
});

const mapAdminAnnouncement = (row: AdminAnnouncementRow): AdminAnnouncement => ({
  ...mapAnnouncement(row),
  isActive: row.is_active,
});

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_announcements")
    .select(PUBLIC_COLUMNS)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Duyurular alınamadı", error);
    return [];
  }

  return data.map(mapAnnouncement);
};

export const fetchAllAnnouncements = async (): Promise<AdminAnnouncement[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("announcements")
    .select(ADMIN_COLUMNS)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Duyurular alınamadı", error);
    return [];
  }

  return (data as AdminAnnouncementRow[]).map(mapAdminAnnouncement);
};

export const createAnnouncement = async (input: AnnouncementInput): Promise<void> => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("announcements").insert({
    title: input.title,
    body: input.body,
    image_url: input.imageUrl ?? null,
    display_order: input.displayOrder ?? 0,
    is_active: input.isActive ?? true,
  });

  if (error) {
    console.error("Duyuru oluşturulamadı", error);
    throw new Error("ANNOUNCEMENT_CREATE_FAILED");
  }
};

export const updateAnnouncement = async (
  id: string,
  input: AnnouncementInput,
): Promise<void> => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title: input.title,
      body: input.body,
      image_url: input.imageUrl ?? null,
      display_order: input.displayOrder ?? 0,
      is_active: input.isActive ?? true,
    })
    .eq("id", id);

  if (error) {
    console.error("Duyuru güncellenemedi", error);
    throw new Error("ANNOUNCEMENT_UPDATE_FAILED");
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    console.error("Duyuru silinemedi", error);
    throw new Error("ANNOUNCEMENT_DELETE_FAILED");
  }
};
