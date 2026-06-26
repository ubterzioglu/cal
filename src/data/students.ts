import { supabase } from "@/lib/supabase";

export type StudentProfile = {
  id: string;
  fullName: string;
  graduationYear: number;
  graduationTerm: string;
  whatsappNumber: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  shortBio: string | null;
  isAnonymous: boolean;
  createdAt: string;
};

type StudentRow = {
  id: string;
  full_name: string;
  graduation_year: number;
  graduation_term: string;
  whatsapp_number: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  short_bio: string | null;
  is_anonymous: boolean | null;
  created_at: string;
};

const PUBLIC_COLUMNS =
  "id, full_name, graduation_year, graduation_term, whatsapp_number, linkedin_url, instagram_url, short_bio, is_anonymous, created_at";

const mapStudent = (row: StudentRow): StudentProfile => ({
  id: row.id,
  fullName: row.full_name,
  graduationYear: row.graduation_year,
  graduationTerm: row.graduation_term,
  whatsappNumber: row.whatsapp_number,
  linkedinUrl: row.linkedin_url,
  instagramUrl: row.instagram_url,
  shortBio: row.short_bio ?? "",
  isAnonymous: row.is_anonymous ?? true,
  createdAt: row.created_at,
});

export type StudentProfileInput = {
  fullName: string;
  graduationYear: number;
  graduationTerm: string;
  whatsappNumber?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  shortBio?: string | null;
  isAnonymous?: boolean;
};

export const fetchStudents = async (): Promise<StudentProfile[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_student_profiles")
    .select(PUBLIC_COLUMNS)
    .order("graduation_year", { ascending: false });

  if (error || !data) {
    console.error("Öğrenci profilleri alınamadı", error);
    return [];
  }

  return data.map(mapStudent);
};

export const fetchStudentById = async (id: string): Promise<StudentProfile | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("public_student_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Öğrenci profili alınamadı", error);
    return null;
  }

  return mapStudent(data as StudentRow);
};

// The signed-in user's own student profile (raw table, gated by RLS).
export const fetchMyStudentProfile = async (
  userId: string,
): Promise<StudentProfile | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("student_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Öğrenci profili alınamadı", error);
    return null;
  }

  return data ? mapStudent(data as StudentRow) : null;
};

// Create or update the signed-in user's student profile. RLS enforces that
// user_id matches auth.uid(), so a user can only ever write their own row.
export const upsertMyStudentProfile = async (
  userId: string,
  input: StudentProfileInput,
): Promise<StudentProfile | null> => {
  if (!supabase) {
    return null;
  }

  const payload = {
    user_id: userId,
    full_name: input.fullName,
    graduation_year: input.graduationYear,
    graduation_term: input.graduationTerm,
    whatsapp_number: input.whatsappNumber ?? null,
    linkedin_url: input.linkedinUrl ?? null,
    instagram_url: input.instagramUrl ?? null,
    short_bio: input.shortBio ?? null,
    is_anonymous: input.isAnonymous ?? true,
  };

  const { data, error } = await supabase
    .from("student_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select(PUBLIC_COLUMNS)
    .single();

  if (error || !data) {
    console.error("Öğrenci profili kaydedilemedi", error);
    throw new Error("Öğrenci profili kaydedilemedi");
  }

  return mapStudent(data as StudentRow);
};
