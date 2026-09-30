import { readJsonBody, sendJson } from "./httpUtils.mjs";
import { teachWithJeremiah } from "./teacherCore.mjs";

export async function handleJeremiahApi(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const result = await teachWithJeremiah(payload);
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 400, {
      error: error?.message || "Jeremiah could not process this move.",
    });
  }
}
