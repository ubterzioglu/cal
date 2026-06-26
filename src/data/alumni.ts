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
    .select(
      "id, graduation_year, full_name, linkedin_url, instagram_url, email, whatsapp_number, short_bio, support_topics, is_anonymous, created_at",
    )
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
    .select(
      "id, graduation_year, full_name, linkedin_url, instagram_url, email, whatsapp_number, short_bio, support_topics, is_anonymous, created_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Mezun profili alınamadı", error);
    return null;
  }

  return mapAlumni(data as AlumniRow);
};

export const createAlumniProfile = async (input: AlumniProfileInput): Promise<AlumniProfile | null> => {
  if (!supabase) {
    return null;
  }

  const response = await fetch("/api/alumni-profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      graduationYear: input.graduationYear,
      fullName: input.fullName,
      whatsappNumber: input.whatsappNumber,
      email: input.email ?? null,
      linkedinUrl: input.linkedinUrl ?? null,
      instagramUrl: input.instagramUrl ?? null,
      shortBio: input.shortBio ?? null,
      supportTopics: input.supportTopics ?? [],
      isAnonymous: input.isAnonymous ?? false,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    console.error("Mezun profili oluşturulamadı", errorPayload);
    throw new Error("Mezun profili oluşturulamadı");
  }

  const payload = await response.json();
  if (!payload?.data) {
    throw new Error("Mezun profili oluşturulamadı");
  }

  return mapAlumni(payload.data as AlumniRow);
};
