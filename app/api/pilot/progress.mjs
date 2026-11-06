import {handlePilotProgress} from '../../server/pilotProgressHandler.mjs';
export default async function handler(req,res){await handlePilotProgress(req,res);}
