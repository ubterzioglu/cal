// Post-build prerender: renders each public route with a headless browser
// and writes the fully-rendered HTML to dist/<route>/index.html so that
// crawlers and LLM bots (which do not run JS) see real content + meta.
//
// Runs after `vite build` (see package.json "build").

import http from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer";

import { PUBLIC_ROUTES } from "./public-routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const indexFile = path.join(distDir, "index.html");
const PORT = 4321;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const fileExists = async (p) => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

// Minimal static server with SPA fallback to index.html.
const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
      const requested = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      const resolved = path.resolve(distDir, requested);

      let filePath = indexFile;
      if (
        requested &&
        (resolved === distDir || resolved.startsWith(`${distDir}${path.sep}`)) &&
        (await fileExists(resolved))
      ) {
        filePath = resolved;
      }

      const ext = path.extname(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", mimeTypes[ext] ?? "application/octet-stream");
      createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, () => resolve(server));
  });

const routeToOutputFile = (routePath) => {
  if (routePath === "/") return indexFile;
  const dir = path.join(distDir, routePath.replace(/^\/+/, ""));
  return path.join(dir, "index.html");
};

const run = async () => {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let rendered = 0;
  try {
    for (const route of PUBLIC_ROUTES) {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route.path}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      // Ensure React + Helmet committed.
      await page.waitForSelector("#root h1, #root main", { timeout: 15000 }).catch(() => {});

      const html = await page.content();
      const outFile = routeToOutputFile(route.path);
      await mkdir(path.dirname(outFile), { recursive: true });
      await writeFile(outFile, html, "utf-8");
      await page.close();
      rendered += 1;
      console.log(`prerendered ${route.path} -> ${path.relative(distDir, outFile)}`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`prerender complete: ${rendered}/${PUBLIC_ROUTES.length} routes`);
};

run().catch((error) => {
  console.error("prerender failed:", error);
  process.exit(1);
});
