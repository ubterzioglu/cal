import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");

const getAllowedOrigins = () => {
  const configured = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => normalizeOrigin(origin)).filter(Boolean);
  return configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS;
};

// Pure CORS decision so it can be unit-tested in isolation.
// A request is allowed only when its Origin is same-host or explicitly
// allow-listed. Requests with NO Origin header are rejected: legitimate
// browser fetch() calls to these cross-path write endpoints always send an
// Origin, so a missing one indicates a non-browser client (curl, bot,
// server-to-server) that should not reach the write path.
export const isOriginAllowed = (origin, host, allowedOrigins) => {
  if (!origin) {
    return false;
  }

  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const isSameHost = Boolean(host) && originHost === host;
  return isSameHost || allowedOrigins.includes(origin);
};

export const applyCors = (req, res) => {
  const origin = normalizeOrigin(req.headers?.origin);
  const host = req.headers?.host;
  const allowedOrigins = getAllowedOrigins();

  const isAllowed = isOriginAllowed(origin, host, allowedOrigins);

  if (origin && isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (!isAllowed) {
    res.statusCode = 403;
    res.end("Forbidden origin");
    return false;
  }

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return false;
  }

  return true;
};

export const json = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

export const readJsonBody = (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return null;
};

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export const trimText = (value) => (typeof value === "string" ? value.trim() : "");

export const clampList = (values, maxItems) => values.slice(0, maxItems);

export const filterStringList = (values) => values.filter((item) => typeof item === "string" && item.trim().length > 0);

export const hashText = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

const getRequestIp = (req) => {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]?.trim();
  }

  return req.headers?.["x-real-ip"] || req.socket?.remoteAddress || "";
};

export const getIpHash = (req) => {
  const salt = process.env.IP_HASH_SALT || "";
  const rawIp = getRequestIp(req) || "unknown";
  return hashText(`${salt}:${rawIp}`);
};

// Verifies the bearer token against Supabase Auth and returns the user,
// or null if missing/invalid. Used by endpoints that require a signed-in
// caller (unlike the anonymous, rate-limited write endpoints elsewhere here).
export const getAuthenticatedUser = async (req, supabase) => {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

  if (!token) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user;
};

let zohoTransporter = null;

// Lazily builds (and caches) a Zoho Mail SMTP transporter. Returns null when
// Zoho credentials are not configured, so callers can treat email as
// best-effort and not fail the request over it.
export const getZohoTransporter = () => {
  if (zohoTransporter) {
    return zohoTransporter;
  }

  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  zohoTransporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.eu",
    port: Number(process.env.ZOHO_SMTP_PORT) || 465,
    secure: true,
    auth: { user, pass },
  });

  return zohoTransporter;
};

export const sendAdminNotificationEmail = async ({ subject, text }) => {
  const transporter = getZohoTransporter();
  const to = process.env.ADMIN_NOTIFY_EMAIL;

  if (!transporter || !to) {
    return;
  }

  await transporter.sendMail({
    from: process.env.ZOHO_SMTP_USER,
    to,
    subject,
    text,
  });
};

export const enforceRateLimit = async ({
  supabase,
  key,
  ipHash,
  windowSeconds,
  limit,
}) => {
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count, error } = await supabase
    .from("api_rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("key", key)
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (error) {
    throw error;
  }

  if ((count ?? 0) >= limit) {
    const rateError = new Error("RATE_LIMITED");
    rateError.code = "RATE_LIMITED";
    throw rateError;
  }

  const { error: insertError } = await supabase
    .from("api_rate_limit_events")
    .insert({ key, ip_hash: ipHash });

  if (insertError) {
    throw insertError;
  }
};
