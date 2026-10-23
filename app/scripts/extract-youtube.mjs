import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { extractChannelCatalog, extractPublicCaptions } from "../server/youtubeChannelImport.mjs";

function flagsFromArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i]?.startsWith("--") || !argv[i + 1]) throw new Error("Arguments must be --name value pairs.");
    flags[argv[i].slice(2)] = argv[i + 1];
  }
  return flags;
}

async function main() {
  const flags = flagsFromArgs(process.argv.slice(2));
  const binary = flags.binary || "yt-dlp";
  if (flags.channel && !flags.video) {
    const limit = flags.limit ? Number(flags.limit) : 80;
    const catalog = await extractChannelCatalog({
      channelUrl: flags.channel, limit, standardId: flags.standard || "", binary,
    });
    const output = path.resolve(flags.out || ".jeremiah-research/youtube-channel-" +
      new Date().toISOString().replace(/[:.]/g, "-") + ".json");
    if (!output.includes(path.sep + ".jeremiah-research" + path.sep)) {
      throw new Error("Research output must be saved under a .jeremiah-research folder.");
    }
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, JSON.stringify(catalog, null, 2) + "\n", { flag: "wx" });
    console.log(JSON.stringify({
      output,
      channelTitle: catalog.channelTitle,
      channelUrl: catalog.channelUrl,
      extractedCount: catalog.extractedCount,
      standard: catalog.standardId || "not filtered",
      titleMatchCandidates: catalog.titleMatchCandidates.map((item) => ({ title: item.title, url: item.url, matchBasis: item.matchBasis })),
      videos: catalog.videos.slice(0, 25).map((item) => ({ title: item.title, url: item.url })),
      note: catalog.note,
    }, null, 2));
    return;
  }
  if (flags.video && !flags.channel) {
    const dir = path.resolve(flags.outdir || ".jeremiah-research/youtube-captions");
    if (!dir.includes(path.sep + ".jeremiah-research" + path.sep)) {
      throw new Error("Captions must be saved under a .jeremiah-research folder.");
    }
    await mkdir(dir, { recursive: true });
    const result = await extractPublicCaptions({
      video: flags.video, outputDir: dir, language: flags.language || "en", binary,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  throw new Error("Supply exactly one: --channel https://www.youtube.com/@handle/videos OR --video VIDEO_ID.");
}

main().catch((error) => {
  console.error("YouTube research import failed: " + error.message);
  process.exitCode = 1;
});
