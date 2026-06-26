import { supabase } from "@/lib/supabase";

export type AlumniProfile = {
  id: string;
  graduationYear: number;
  fullName: string;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  email: string | null;
  whatsappNumber: string;
  shortBio: string;
  supportTopics: string[];
  isAnonymous: boolean;
  createdAt: string;
};

type AlumniRow = {
  id: string;
  graduation_year: number;
  full_name: string;
  linkedin_url: string | null;
  instagram_url: string | null;
  email: string | null;
  whatsapp_number: string;
  short_bio: string | null;
  support_topics: string[] | null;
  is_anonymous: boolean | null;
  created_at: string;
};

const PUBLIC_COLUMNS =
  "id, graduation_year, full_name, linkedin_url, instagram_url, email, whatsapp_number, short_bio, support_topics, is_anonymous, created_at";

const mapAlumni = (row: AlumniRow): AlumniProfile => ({
  id: row.id,
  graduationYear: row.graduation_year,
  fullName: row.full_name,
  linkedinUrl: row.linkedin_url,
  instagramUrl: row.instagram_url,
  email: row.email,
  whatsappNumber: row.whatsapp_number,
  shortBio: row.short_bio ?? "",
  supportTopics: row.support_topics ?? [],
  isAnonymous: row.is_anonymous ?? false,
  createdAt: row.created_at,
});

export type AlumniProfileInput = {
  graduationYear: number;
  fullName: string;
  whatsappNumber: string;
  email?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  shortBio?: string | null;
  supportTopics?: string[];
  isAnonymous?: boolean;
};

export const fetchAlumni = async (): Promise<AlumniProfile[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_alumni_profiles")
    .select(PUBLIC_COLUMNS)
    .order("graduation_year", { ascending: false });

  if (error || !data) {
    console.error("Mezun profilleri alınamadı", error);
    return [];
  }

  return data.map(mapAlumni);
};

export const fetchAlumniById = async (id: string): Promise<AlumniProfile | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("public_alumni_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Mezun profili alınamadı", error);
    return null;
  }

  return mapAlumni(data as AlumniRow);
};

// The signed-in user's own alumni profile (raw table, gated by RLS).
export const fetchMyAlumniProfile = async (
  userId: string,
): Promise<AlumniProfile | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("alumni_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Mezun profili alınamadı", error);
    return null;
  }

  return data ? mapAlumni(data as AlumniRow) : null;
};

// Create or update the signed-in user's alumni profile. RLS enforces that
// user_id matches auth.uid(), so a user can only ever write their own row.
export const upsertMyAlumniProfile = async (
  userId: string,
  input: AlumniProfileInput,
): Promise<AlumniProfile | null> => {
  if (!supabase) {
    return null;
  }

  const payload = {
    user_id: userId,
    graduation_year: input.graduationYear,
    full_name: input.fullName,
    whatsapp_number: input.whatsappNumber,
    email: input.email ?? null,
    linkedin_url: input.linkedinUrl ?? null,
    instagram_url: input.instagramUrl ?? null,
    short_bio: input.shortBio ?? null,
    support_topics: input.supportTopics ?? [],
    is_anonymous: input.isAnonymous ?? false,
  };

  const { data, error } = await supabase
    .from("alumni_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select(PUBLIC_COLUMNS)
    .single();

  if (error || !data) {
    console.error("Mezun profili kaydedilemedi", error);
    throw new Error("Mezun profili kaydedilemedi");
  }

  return mapAlumni(data as AlumniRow);
};
