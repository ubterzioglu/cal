import { supabase } from "@/lib/supabase";

export type StudentEvent = {
  id: string;
  slug: string;
  name: string;
  shortInfo: string;
  longInfo: string;
  supportNeeded: boolean;
  supportTypes: string[];
  financialSupportInfo: string;
  financialSupportBankName: string;
  financialSupportIban: string;
  financialSupportDescription: string;
  moralSupportText: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  responsiblePeople: string[];
  developments: string[];
  createdAt: string;
};

export type StudentEventRow = {
  id: string;
  slug: string;
  name: string;
  short_info: string | null;
  long_info: string | null;
  support_needed: boolean | null;
  support_types: string[] | null;
  financial_support_info: string | null;
  financial_support_bank_name: string | null;
  financial_support_iban: string | null;
  financial_support_description: string | null;
  moral_support_text: string | null;
  image_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  responsible_people: string[] | null;
  developments: string[] | null;
  created_at: string;
};

const mapEvent = (event: StudentEventRow): StudentEvent => ({
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
});

export const fetchEvents = async (): Promise<StudentEvent[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_student_events")
    .select(
      "id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at",
    )
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Etkinlikler alınamadı", error);
    return [];
  }

  return data.map(mapEvent);
};

export const fetchEventBySlug = async (slug: string): Promise<StudentEvent | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("public_student_events")
    .select(
      "id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at",
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Etkinlik detayı alınamadı", error);
    return null;
  }

  return mapEvent(data as StudentEventRow);
};
