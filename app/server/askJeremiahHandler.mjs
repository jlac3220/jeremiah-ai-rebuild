import { readJsonBody, sendJson } from "./httpUtils.mjs";
import { answerAskJeremiah } from "./askJeremiahCore.mjs";

export async function handleAskJeremiah(req,res) {
 if(req.method!=="POST"){sendJson(res,405,{error:"Method not allowed"});return;}
 try {
  const body=await readJsonBody(req,25_000);
  const result=await answerAskJeremiah(body);
  sendJson(res,200,result);
 } catch(error){
  sendJson(res,error?.status||500,{error:error?.message||"Ask Jeremiah is temporarily unavailable."});
 }
}
