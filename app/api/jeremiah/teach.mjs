// Vercel Node Function: preserve the same API behavior as the local Jeremiah server.
import { handleJeremiahApi } from '../../server/apiHandler.mjs';

export default async function handler(req, res) {
  await handleJeremiahApi(req, res);
}
