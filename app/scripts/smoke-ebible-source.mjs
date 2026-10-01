import { handleBibleApi } from "../server/bibleHandler.mjs";

function requestChapter(translation) {
  return new Promise((resolve, reject) => {
    let body = "";
    const req = {
      url: `/?translation=${translation}&book=Deut&chapter=6`,
      headers: { host: "localhost" },
    };
    const res = {
      statusCode: 200,
      setHeader() {},
      end(value = "") {
        body += String(value);
        try {
          const payload = JSON.parse(body);
          if (this.statusCode !== 200) {
            reject(new Error(payload?.error || `Bible API returned ${this.statusCode}`));
            return;
          }
          resolve(payload);
        } catch (error) {
          reject(error);
        }
      },
    };

    handleBibleApi(req, res).catch(reject);
  });
}

for (const translation of ["kjv", "asv", "web"]) {
  const payload = await requestChapter(translation);

  if (!Array.isArray(payload.verses) || payload.verses.length !== 25) {
    throw new Error(`${translation}: expected 25 verses in Deuteronomy 6, got ${payload.verses?.length ?? "none"}`);
  }

  const verse4 = payload.verses.find((item) => Number(item.verse) === 4);
  if (!verse4?.text || !/one/i.test(verse4.text)) {
    throw new Error(`${translation}: Deuteronomy 6:4 did not parse correctly.`);
  }

  const lastVerse = payload.verses[payload.verses.length - 1];
  if (/public domain|deuteronomy\s+[<>]|download/i.test(lastVerse.text) || lastVerse.text.length > 900) {
    throw new Error(`${translation}: trailing page content leaked into the final verse.`);
  }

  console.log(`${translation.toUpperCase()} Deuteronomy 6: ${payload.verses.length} verses verified from eBible.org`);
}
