export async function readJsonBody(req, maxBytes = 64_000) {
  // Vercel's Node runtime may populate req.body before invoking our handler.
  // Reading the consumed stream again would hang the request indefinitely.
  if (req.body !== undefined && req.body !== null) {
    const source = req.body;
    const raw = typeof source === 'string' ? source : JSON.stringify(source);
    if (Buffer.byteLength(raw, 'utf8') > maxBytes) throw new Error('Request too large');
    if(typeof source!=='string')return source;
    try{return JSON.parse(source)}catch{throw new Error('Invalid JSON');}
  }
  return new Promise((resolve, reject) => {
    let body = "",bytes=0,tooLarge=false;
    req.on("data", (chunk) => {
      if(tooLarge)return;
      bytes+=Buffer.byteLength(chunk);
      if(bytes>maxBytes){tooLarge=true;body="";reject(new Error("Request too large"));return;}
      body+=chunk;
    });
    req.on("end", () => {
      if(tooLarge)return;
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
