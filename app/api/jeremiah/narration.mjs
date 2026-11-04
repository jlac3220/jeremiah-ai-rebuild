// Vercel Node Function: preserve the same API behavior as the local Jeremiah server.
import { handleNarrationApi } from '../../server/narrationHandler.mjs';

export default async function handler(req, res) {
  await handleNarrationApi(req, res);
}
