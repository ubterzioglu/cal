import {
  applyCors,
  enforceRateLimit,
  getSupabaseAdmin,
  getIpHash,
  json,
  readJsonBody,
  trimText,
} from "./_shared.js";

const MAX_NAME = 120;
const MAX_TERM = 40;

// student_profiles DB constraints: graduation_year between 1990 and 2030, and <> 2010.
const isValidYear = (year) =>
  Number.isInteger(year) && year >= 1990 && year <= 2030 && year !== 2010;

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== "POST") {
    json(res, 405, { error: "METHOD_NOT_ALLOWED" });
    return;
  }

  const body = readJsonBody(req);
  if (!body) {
    json(res, 400, { error: "INVALID_JSON" });
    return;
  }

  const fullName = trimText(body.fullName);
  const graduationYear = Number(body.graduationYear);
  const graduationTerm = trimText(body.graduationTerm);

  if (!fullName || fullName.length > MAX_NAME) {
    json(res, 400, { error: "INVALID_FULL_NAME" });
    return;
  }

  if (!isValidYear(graduationYear)) {
    json(res, 400, { error: "INVALID_GRADUATION_YEAR" });
    return;
  }

  if (!graduationTerm || graduationTerm.length > MAX_TERM) {
    json(res, 400, { error: "INVALID_GRADUATION_TERM" });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const ipHash = getIpHash(req);

    await enforceRateLimit({
      supabase,
      key: "student_profiles:create:1h",
      ipHash,
      windowSeconds: 60 * 60,
      limit: 5,
    });

    await enforceRateLimit({
      supabase,
      key: "student_profiles:create:24h",
      ipHash,
      windowSeconds: 60 * 60 * 24,
      limit: 20,
    });

    await enforceRateLimit({
      supabase,
      key: "student_profiles:create:7d",
      ipHash,
      windowSeconds: 60 * 60 * 24 * 7,
      limit: 50,
    });

    const { data: inserted, error: insertError } = await supabase
      .from("student_profiles")
      .insert({
        full_name: fullName,
        graduation_year: graduationYear,
        graduation_term: graduationTerm,
        is_anonymous: true,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      json(res, 400, { error: "INSERT_FAILED" });
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("public_student_profiles")
      .select("id, full_name, graduation_year, graduation_term, is_anonymous, created_at")
      .eq("id", inserted.id)
      .single();

    if (fetchError || !data) {
      json(res, 500, { error: "FETCH_FAILED" });
      return;
    }

    json(res, 201, { data });
  } catch (error) {
    if (error?.code === "RATE_LIMITED") {
      json(res, 429, { error: "RATE_LIMITED" });
      return;
    }
    console.error(error);
    json(res, 500, { error: "SERVER_ERROR" });
  }
}
