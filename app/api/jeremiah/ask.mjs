// Vercel Node Function: preserve the same API behavior as the local Jeremiah server.
import { handleAskJeremiah } from '../../server/askJeremiahHandler.mjs';

export default async function handler(req, res) {
  await handleAskJeremiah(req, res);
}
