import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleJeremiahApi } from "./server/apiHandler.mjs";
import { handleBibleApi } from "./server/bibleHandler.mjs";
import { loadLocalEnv } from "./server/loadEnv.mjs";

await loadLocalEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

async function serveFile(res, filePath) {
  const bytes = await readFile(filePath);
  res.statusCode = 200;
  res.setHeader("Content-Type", mimeTypes[path.extname(filePath)] || "application/octet-stream");
  res.end(bytes);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/jeremiah/teach") {
    await handleJeremiahApi(req, res);
    return;
  }

  if (url.pathname === "/api/bible/chapter") {
    await handleBibleApi(req, res);
    return;
  }

  try {
    const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const candidate = path.normalize(path.join(distDir, requested));

    if (!candidate.startsWith(distDir)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    try {
      const info = await stat(candidate);
      if (info.isFile()) {
        await serveFile(res, candidate);
        return;
      }
    } catch {
      // SPA fallback below.
    }

    await serveFile(res, path.join(distDir, "index.html"));
  } catch (error) {
    res.statusCode = 500;
    res.end(error?.message || "Server error");
  }
});

server.listen(port, () => {
  console.log(`Jeremiah.app listening on http://localhost:${port}`);
});
