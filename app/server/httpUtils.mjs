export async function readJsonBody(req, maxBytes = 64_000) {
  // Vercel's Node runtime may populate req.body before invoking our handler.
  // Reading the consumed stream again would hang the request indefinitely.
  if (req.body !== undefined && req.body !== null) {
    const source = req.body;
    const raw = typeof source === 'string' ? source : JSON.stringify(source);
    if (Buffer.byteLength(raw, 'utf8') > maxBytes) throw new Error('Request too large');
    return typeof source === 'string' ? JSON.parse(source) : source;
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error("Request too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}
