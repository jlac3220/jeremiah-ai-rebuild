import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadLocalEnv } from "../server/loadEnv.mjs";
import { parseTranscript, proposeMediaEnrichment, transcribeLocalMedia } from "../server/mediaEnrichment.mjs";

function parseFlags(argv) {
  const flags = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    if (!flag?.startsWith("--") || !argv[index + 1]?.trim()) {
      throw new Error("Pass arguments as --name value pairs.");
    }
    flags[flag.slice(2)] = argv[index + 1];
  }
  return flags;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  if ((!flags.transcript && !flags.media) || (flags.transcript && flags.media)) {
    throw new Error("Supply exactly one of --transcript <file> or --media <file>.");
  }
  const rights = flags.rights || "external-reference";
  if (flags.media && rights === "external-reference") {
    throw new Error("Uploading media requires rights: owned, licensed, permission or public-domain.");
  }
  await loadLocalEnv();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Add OPENAI_API_KEY to the server-side .env first.");

  let transcript;
  if (flags.transcript) {
    const ext = path.extname(flags.transcript).toLowerCase();
    if (![".txt", ".srt", ".vtt"].includes(ext)) {
      throw new Error("Transcript must be a .txt, .srt or .vtt file.");
    }
    transcript = parseTranscript(await readFile(flags.transcript, "utf8"), ext);
  } else {
    transcript = await transcribeLocalMedia(flags.media, apiKey);
  }
  const proposal = await proposeMediaEnrichment({
    standardId: flags.standard || "OG.1.1.18",
    transcript,
    apiKey,
    source: {
      title: flags.title || "",
      url: flags.url || "",
      publisher: flags.publisher || "",
      rights,
      rightsEvidence: flags["rights-evidence"] || "",
    },
  });

  const output = flags.out || path.join(".jeremiah-research", proposal.id + ".json");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(proposal, null, 2) + "\n", { flag: "w" });
  console.log(JSON.stringify({
    output,
    standard: proposal.standardId,
    status: proposal.status,
    relevance: proposal.relevance,
    modelRelevance: proposal.modelRelevance,
    assessment: proposal.assessment,
    evidenceReview: proposal.evidenceReview,
    claims: proposal.claims.length,
    activities: proposal.activities.length,
    concerns: proposal.concerns.length,
    note: "Human verification required before adding anything to a lesson.",
  }, null, 2));
}

main().catch((error) => {
  console.error("Research failed: " + error.message);
  process.exitCode = 1;
});
