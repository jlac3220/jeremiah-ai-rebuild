// Vercel Node Function: preserve the same API behavior as the local Jeremiah server.
import { handlePilotFeedback } from '../../server/pilotFeedbackHandler.mjs';

export default async function handler(req, res) {
  await handlePilotFeedback(req, res);
}
