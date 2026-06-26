import { supabase } from "@/lib/supabase";

export type Club = {
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

type ClubRow = {
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

const mapClub = (club: ClubRow): Club => ({
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
});

export const fetchClubs = async (): Promise<Club[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_clubs")
    .select("id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at")
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Kulüpler alınamadı", error);
    return [];
  }

  return data.map(mapClub);
};

export const fetchClubBySlug = async (slug: string): Promise<Club | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("public_clubs")
    .select("id, slug, name, short_info, long_info, support_needed, support_types, financial_support_info, financial_support_bank_name, financial_support_iban, financial_support_description, moral_support_text, image_url, website_url, contact_email, responsible_people, developments, created_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Kulüp detayı alınamadı", error);
    return null;
  }

  return mapClub(data as ClubRow);
};
