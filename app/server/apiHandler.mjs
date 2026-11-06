import {og1Only,OG1_STANDARD} from './pilotCapabilities.mjs';
import {withPilotService} from './pilotSecurity.mjs';
import { readJsonBody, sendJson } from "./httpUtils.mjs";
import { teachWithJeremiah } from "./teacherCore.mjs";

async function handleJeremiahApiUnchecked(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    if(og1Only(req)&&payload?.standardId!==OG1_STANDARD){sendJson(res,403,{error:'Only the OG.1 lesson is available in this evaluation.'});return;}
    const result = await teachWithJeremiah(payload);
    sendJson(res, 200, result);
  } catch (error) {
    const invalid=['Unknown Jeremiah standard.','Unknown instructional move.','Invalid JSON','Request too large'].includes(error?.message);
    if(!invalid)res.setHeader('Retry-After','60');
    sendJson(res,invalid?400:503,{error:invalid?error.message:"Jeremiah is temporarily unavailable. Your answer remains on this device."});
  }
}

export async function handleJeremiahApi(req,res){return withPilotService(req,res,'teach',()=>handleJeremiahApiUnchecked(req,res));}
