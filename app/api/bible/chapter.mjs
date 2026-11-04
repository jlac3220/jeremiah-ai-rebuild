// Vercel Node Function: preserve the same API behavior as the local Jeremiah server.
import { handleBibleApi } from '../../server/bibleHandler.mjs';

export default async function handler(req, res) {
  await handleBibleApi(req, res);
}
