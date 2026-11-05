import {handlePilotAccess} from '../../server/pilotSecurity.mjs';
export default async function handler(req,res){await handlePilotAccess(req,res);}
