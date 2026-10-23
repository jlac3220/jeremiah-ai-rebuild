import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { discoverMediaCandidates } from "../server/mediaDiscovery.mjs";

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!args[i]?.startsWith("--") || !args[i + 1]) throw new Error("Arguments must be --name value pairs.");
    flags[args[i].slice(2)] = args[i + 1];
  }
  return flags;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const standardId = flags.standard || "OG.1.1.18";
  const limit = flags.limit ? Number(flags.limit) : 12;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error("--limit must be 1 through 50.");
  const proposal = await discoverMediaCandidates({ standardId, limit });
  const output = flags.out || path.join(".jeremiah-research", proposal.id + ".json");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(proposal, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify({
    output, standardId,
    candidates: proposal.candidates.map(({ title, publisher, url, origin, matchScore }) => ({
      title, publisher, url, origin, matchScore,
    })),
    warnings: proposal.warnings,
    note: proposal.note,
  }, null, 2));
}

main().catch((error) => {
  console.error("Discovery failed: " + error.message);
  process.exitCode = 1;
});
