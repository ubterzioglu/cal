import { supabase } from "@/lib/supabase";

export type StudentProfile = {
  id: string;
  fullName: string;
  graduationYear: number;
  graduationTerm: string;
  isAnonymous: boolean;
  createdAt: string;
};

type StudentRow = {
  id: string;
  full_name: string;
  graduation_year: number;
  graduation_term: string;
  is_anonymous: boolean | null;
  created_at: string;
};

const mapStudent = (row: StudentRow): StudentProfile => ({
  id: row.id,
  fullName: row.full_name,
  graduationYear: row.graduation_year,
  graduationTerm: row.graduation_term,
  isAnonymous: row.is_anonymous ?? true,
  createdAt: row.created_at,
});

export type StudentProfileInput = {
  fullName: string;
  graduationYear: number;
  graduationTerm: string;
};

export const fetchStudents = async (): Promise<StudentProfile[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_student_profiles")
    .select("id, full_name, graduation_year, graduation_term, is_anonymous, created_at")
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
    .select("id, full_name, graduation_year, graduation_term, is_anonymous, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Öğrenci profili alınamadı", error);
    return null;
  }

  return mapStudent(data as StudentRow);
};

export const createStudentProfile = async (
  input: StudentProfileInput,
): Promise<StudentProfile | null> => {
  if (!supabase) {
    return null;
  }

  const response = await fetch("/api/student-profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: input.fullName,
      graduationYear: input.graduationYear,
      graduationTerm: input.graduationTerm,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    console.error("Öğrenci profili oluşturulamadı", errorPayload);
    throw new Error("Öğrenci profili oluşturulamadı");
  }

  const payload = await response.json();
  if (!payload?.data) {
    throw new Error("Öğrenci profili oluşturulamadı");
  }

  return mapStudent(payload.data as StudentRow);
};
