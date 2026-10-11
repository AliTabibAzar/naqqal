// تست محلی خروجی استاتیک زیرمسیر /naqqal (شبیه GitHub Pages)
// اجرا: node scripts/serve-out.mjs  — بعد Ctrl+C
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, statSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const BASE = "/naqqal";
const PORT = 3001;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

async function serve(res, file) {
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    try {
      const nf = await readFile(join(ROOT, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(nf);
    } catch {
      res.writeHead(404);
      res.end("nf");
    }
  }
}

createServer((req, res) => {
  let path = new URL(req.url ?? "/", "http://x").pathname;
  if (!path.startsWith(BASE)) {
    res.writeHead(404);
    res.end("expected /naqqal prefix");
    return;
  }
  path = path.slice(BASE.length) || "/";
  if (path.endsWith("/")) path += "index.html";
  let file = join(ROOT, path);
  const isFile = existsSync(file) && !statSync(file).isDirectory();
  if (!isFile && !extname(path)) {
    // clean URL مثل /story/x → /story/x.html
    file = join(ROOT, path + ".html");
  }
  void serve(res, file);
}).listen(PORT, () => console.log(`serving out/ at http://localhost:${PORT}${BASE}`));
