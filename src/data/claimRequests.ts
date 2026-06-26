import { supabase } from "@/lib/supabase";

export type ClaimEntityType = "club" | "event" | "team";

export type ClaimStatus = "pending" | "approved" | "rejected";

export type ClaimRequest = {
  id: string;
  entityType: ClaimEntityType;
  entityId: string;
  userId: string;
  status: ClaimStatus;
  note: string | null;
  createdAt: string;
};

type ClaimRequestRow = {
  id: string;
  entity_type: ClaimEntityType;
  entity_id: string;
  user_id: string;
  status: ClaimStatus;
  note: string | null;
  created_at: string;
};

const mapClaimRequest = (row: ClaimRequestRow): ClaimRequest => ({
  id: row.id,
  entityType: row.entity_type,
  entityId: row.entity_id,
  userId: row.user_id,
  status: row.status,
  note: row.note,
  createdAt: row.created_at,
});

export type PendingClaimRequest = ClaimRequest & {
  entityName: string;
};

const ENTITY_TABLE: Record<ClaimEntityType, string> = {
  club: "public_clubs",
  event: "public_student_events",
  team: "public_student_teams",
};

export const ENTITY_TYPE_LABEL: Record<ClaimEntityType, string> = {
  club: "Kulüp",
  event: "Etkinlik",
  team: "Takım",
};

const CLAIM_SELECT = "id, entity_type, entity_id, user_id, status, note, created_at";

export const submitClaimRequest = async (
  entityType: ClaimEntityType,
  entityId: string,
  note?: string | null,
): Promise<ClaimRequest | null> => {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const { data, error } = await supabase
    .from("claim_requests")
    .insert({
      entity_type: entityType,
      entity_id: entityId,
      user_id: user.id,
      note: note?.trim() || null,
    })
    .select(CLAIM_SELECT)
    .single();

  if (error || !data) {
    console.error("Sahiplenme talebi gönderilemedi", error);
    throw new Error("CLAIM_SUBMIT_FAILED");
  }

  return mapClaimRequest(data as ClaimRequestRow);
};

export const fetchMyClaimRequest = async (
  entityType: ClaimEntityType,
  entityId: string,
): Promise<ClaimRequest | null> => {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("claim_requests")
    .select(CLAIM_SELECT)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Sahiplenme talebi alınamadı", error);
    return null;
  }

  return data ? mapClaimRequest(data as ClaimRequestRow) : null;
};

// Superadmin-only: pending requests with resolved entity names.
export const fetchPendingClaimRequests = async (): Promise<PendingClaimRequest[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("claim_requests")
    .select(CLAIM_SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Sahiplenme talepleri alınamadı", error);
    return [];
  }

  const requests = data.map((row) => mapClaimRequest(row as ClaimRequestRow));
  const entityNames = await resolveEntityNames(requests);

  return requests.map((request) => ({
    ...request,
    entityName: entityNames.get(`${request.entityType}:${request.entityId}`) ?? request.entityId,
  }));
};

const resolveEntityNames = async (
  requests: ClaimRequest[],
): Promise<Map<string, string>> => {
  const names = new Map<string, string>();
  if (!supabase) {
    return names;
  }

  const idsByType: Record<ClaimEntityType, string[]> = { club: [], event: [], team: [] };
  for (const request of requests) {
    idsByType[request.entityType].push(request.entityId);
  }

  for (const entityType of Object.keys(idsByType) as ClaimEntityType[]) {
    const ids = Array.from(new Set(idsByType[entityType]));
    if (ids.length === 0) {
      continue;
    }

    const { data } = await supabase
      .from(ENTITY_TABLE[entityType])
      .select("id, name")
      .in("id", ids);

    for (const row of (data ?? []) as Array<{ id: string; name: string }>) {
      names.set(`${entityType}:${row.id}`, row.name);
    }
  }

  return names;
};

export const reviewClaimRequest = async (
  requestId: string,
  approve: boolean,
): Promise<void> => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.rpc("review_claim_request", {
    request_id: requestId,
    approve,
  });

  if (error) {
    console.error("Sahiplenme talebi işlenemedi", error);
    throw new Error("CLAIM_REVIEW_FAILED");
  }
};
