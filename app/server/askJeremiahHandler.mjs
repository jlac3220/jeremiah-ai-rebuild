import {withPilotService} from './pilotSecurity.mjs';
import { readJsonBody, sendJson } from "./httpUtils.mjs";
import { answerAskJeremiah } from "./askJeremiahCore.mjs";

async function handleAskJeremiahUnchecked(req,res) {
 if(req.method!=="POST"){sendJson(res,405,{error:"Method not allowed"});return;}
 try {
  const body=await readJsonBody(req,25_000);
  const result=await answerAskJeremiah(body);
  sendJson(res,200,result);
 } catch(error){
  const status=error?.status||503;
  if(status===503||status===429)res.setHeader('Retry-After',status===429?'600':'60');
  sendJson(res,status,{error:status===400?"Please enter a question of up to 1,600 characters.":status===429?"The pilot usage allowance has been reached. Please try again later.":"Ask Jeremiah is temporarily unavailable. Please retry shortly."});
 }
}

export async function handleAskJeremiah(req,res){return withPilotService(req,res,'ask',()=>handleAskJeremiahUnchecked(req,res));}
