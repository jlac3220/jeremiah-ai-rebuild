// Vercel Node Function: preserve the same API behavior as the local Jeremiah server.
import { handleVisualDiscovery } from '../../server/visualDiscoveryHandler.mjs';

export default async function handler(req, res) {
  await handleVisualDiscovery(req, res);
}
