import path from "node:path";
import { loadLocalEnv } from "../server/loadEnv.mjs";
import { ingestAuthorizedSermon } from "../server/authorizedSermonTranscription.mjs";

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i]?.startsWith("--") || !argv[i + 1]) throw new Error("Arguments must be --name value pairs.");
    flags[argv[i].slice(2)] = argv[i + 1];
  }
  return flags;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  if (!flags.media) throw new Error("Supply --media /path/to/authorized-sermon.mp3 or .mp4.");
  await loadLocalEnv();
  const summary = await ingestAuthorizedSermon({
    media: path.resolve(flags.media),
    title: flags.title, publisher: flags.publisher, url: flags.url,
    rights: flags.rights, rightsEvidence: flags["rights-evidence"],
    apiKey: process.env.OPENAI_API_KEY,
    maxMinutes: flags["max-minutes"] ? Number(flags["max-minutes"]) : 90,
    outputDir: path.resolve(".jeremiah-research/authorized-sermon-captions"),
  });
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error("Authorized sermon transcription failed: " + error.message);
  process.exitCode = 1;
});
