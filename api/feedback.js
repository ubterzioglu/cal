import {
  applyCors,
  enforceRateLimit,
  getAuthenticatedUser,
  getIpHash,
  getSupabaseAdmin,
  json,
  readJsonBody,
  sendAdminNotificationEmail,
  trimText,
} from "./_shared.js";

const MAX_MESSAGE = 2000;

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

  const message = trimText(body.message);
  if (!message || message.length > MAX_MESSAGE) {
    json(res, 400, { error: "INVALID_MESSAGE" });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();

    const user = await getAuthenticatedUser(req, supabase);
    if (!user) {
      json(res, 401, { error: "NOT_AUTHENTICATED" });
      return;
    }

    const ipHash = getIpHash(req);

    await enforceRateLimit({
      supabase,
      key: "feedback_submissions:create:1h",
      ipHash,
      windowSeconds: 60 * 60,
      limit: 5,
    });

    await enforceRateLimit({
      supabase,
      key: "feedback_submissions:create:24h",
      ipHash,
      windowSeconds: 60 * 60 * 24,
      limit: 15,
    });

    const { data: inserted, error: insertError } = await supabase
      .from("feedback_submissions")
      .insert({
        user_id: user.id,
        user_email: user.email ?? "bilinmiyor",
        message,
      })
      .select("id, created_at")
      .single();

    if (insertError || !inserted) {
      json(res, 400, { error: "INSERT_FAILED" });
      return;
    }

    try {
      await sendAdminNotificationEmail({
        subject: "CAL Community - Yeni Geri Bildirim / Özellik Önerisi",
        text: `Gönderen: ${user.email ?? "bilinmiyor"}\nTarih: ${inserted.created_at}\n\nMesaj:\n${message}`,
      });
    } catch (mailError) {
      // Email is best-effort: the submission is already saved, so a
      // notification failure should not fail the request.
      console.error("Feedback mail gönderilemedi", mailError);
    }

    json(res, 201, { data: { id: inserted.id } });
  } catch (error) {
    if (error?.code === "RATE_LIMITED") {
      json(res, 429, { error: "RATE_LIMITED" });
      return;
    }
    console.error(error);
    json(res, 500, { error: "SERVER_ERROR" });
  }
}
