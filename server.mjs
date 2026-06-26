import http from "node:http";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";

import alumniProfilesHandler from "./api/alumni-profiles.js";
import studentProfilesHandler from "./api/student-profiles.js";
import solidarityCommentsHandler from "./api/solidarity/comments.js";
import solidarityTopicsHandler from "./api/solidarity/topics.js";

const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const BODY_LIMIT_BYTES = 1024 * 1024;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const indexFilePath = path.join(distDir, "index.html");

const apiRoutes = new Map([
  ["/api/alumni-profiles", alumniProfilesHandler],
  ["/api/student-profiles", studentProfilesHandler],
  ["/api/solidarity/comments", solidarityCommentsHandler],
  ["/api/solidarity/topics", solidarityTopicsHandler],
]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; font-src 'self' data:; script-src 'self' 'unsafe-inline' https://www.clarity.ms; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.clarity.ms https://www.clarity.ms;",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const setDefaultHeaders = (res) => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const sendText = (res, statusCode, message) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
};

const fileExists = async (targetPath) => {
  try {
    const fileStat = await stat(targetPath);
    return fileStat.isFile();
  } catch {
    return false;
  }
};

const resolveAssetPath = async (pathname) => {
  if (pathname === "/") {
    return indexFilePath;
  }

  const decodedPath = decodeURIComponent(pathname);
  const requestedPath = decodedPath.replace(/^\/+/, "");
  const resolvedPath = path.resolve(distDir, requestedPath);

  if (resolvedPath !== distDir && !resolvedPath.startsWith(`${distDir}${path.sep}`)) {
    return null;
  }

  if (await fileExists(resolvedPath)) {
    return resolvedPath;
  }

  if (path.extname(resolvedPath)) {
    return null;
  }

  return indexFilePath;
};

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let totalBytes = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      totalBytes += chunk.length;

      if (totalBytes > BODY_LIMIT_BYTES) {
        reject(new Error("BODY_TOO_LARGE"));
        req.destroy();
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf-8"));
    });

    req.on("error", reject);
  });

const serveStaticFile = async (req, res, pathname) => {
  let filePath;

  try {
    filePath = await resolveAssetPath(pathname);
  } catch {
    sendText(res, 400, "Bad Request");
    return;
  }

  if (!filePath) {
    sendText(res, 404, "Not Found");
    return;
  }

  await access(filePath);

  const fileStat = await stat(filePath);
  const extension = path.extname(filePath);
  const isHtml = extension === ".html";

  res.statusCode = 200;
  res.setHeader("Cache-Control", isHtml ? "no-cache" : "public, max-age=31536000, immutable");
  res.setHeader("Content-Length", fileStat.size);
  res.setHeader("Content-Type", mimeTypes[extension] ?? "application/octet-stream");

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on("error", () => {
    if (!res.headersSent) {
      sendText(res, 500, "Internal Server Error");
      return;
    }
    res.destroy();
  });
  stream.pipe(res);
};

const server = http.createServer(async (req, res) => {
  setDefaultHeaders(res);

  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (requestUrl.pathname === "/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (requestUrl.pathname.startsWith("/api/")) {
    const handler = apiRoutes.get(requestUrl.pathname);

    if (!handler) {
      sendJson(res, 404, { error: "NOT_FOUND" });
      return;
    }

    try {
      req.body = await readRequestBody(req);
    } catch (error) {
      if (error instanceof Error && error.message === "BODY_TOO_LARGE") {
        sendJson(res, 413, { error: "BODY_TOO_LARGE" });
        return;
      }

      console.error(error);
      sendJson(res, 500, { error: "SERVER_ERROR" });
      return;
    }

    try {
      await handler(req, res);
      return;
    } catch (error) {
      console.error(error);
      if (!res.writableEnded) {
        sendJson(res, 500, { error: "SERVER_ERROR" });
      }
      return;
    }
  }

  if (!["GET", "HEAD"].includes(req.method ?? "")) {
    sendText(res, 405, "Method Not Allowed");
    return;
  }

  try {
    await serveStaticFile(req, res, requestUrl.pathname);
  } catch (error) {
    if (error?.code === "ENOENT") {
      sendText(res, 404, "Not Found");
      return;
    }

    console.error(error);
    sendText(res, 500, "Internal Server Error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`CAL Community is listening on port ${PORT}`);
});
