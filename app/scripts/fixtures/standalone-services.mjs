// Isolated browser contracts ONLY. Never configure this preload in a deployment.
if(process.env.JEREMIAH_TEST_FIXTURES!=='yes')throw new Error('Test preload requires explicit local fixture mode');
const {appendFileSync}=await import('node:fs');
globalThis.fetch=async(input,options={})=>{
 const url=String(input);
 if(url==='https://redis.invalid')return Response.json({result:JSON.parse(options.body)[1].startsWith('return {')?['0','0','0','0']:0});
 if(url==='https://api.openai.com/v1/responses'){
  const request=JSON.parse(options.body),data=JSON.parse(request.input[0].content[0].text);
  if(data.learner?.response?.text?.includes('OUTAGE_FIXTURE'))return Response.json({error:{code:'rate_limit_exceeded'}},{status:503});
  return Response.json({id:'resp_local_fixture',output_text:JSON.stringify({verdict:'strong',strategy:'affirm_and_deepen',teacherMessage:'Synthetic semantic response for isolated flow testing.',followUpPrompt:'Continue.',misconceptionIds:[],evidenceObserved:data.currentMove?.evidenceIds||[]}),usage:{input_tokens:0,output_tokens:0}});
 }
 if(url==='https://api.openai.com/v1/audio/speech'){
  const request=JSON.parse(options.body);appendFileSync(process.env.PILOT_TEST_TRACE,JSON.stringify({service:'speech',voice:request.voice})+'\n');
  // No fake voice or fake audio success. Exercise the approved text fallback.
  return Response.json({error:{code:'service_unavailable'}},{status:503});
 }
 if(url.startsWith('https://ebible.org/'))return new Response('<span id="V4">4</span>Hear, O Israel: The LORD our God is one LORD:<span id="V5">5</span>And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.');
 throw new Error('Unexpected external request in isolated browser test');
};
