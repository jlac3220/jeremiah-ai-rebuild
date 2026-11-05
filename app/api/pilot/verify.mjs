import {handlePilotVerification} from '../../server/pilotVerificationHandler.mjs';
export default async function handler(req,res){await handlePilotVerification(req,res);}
