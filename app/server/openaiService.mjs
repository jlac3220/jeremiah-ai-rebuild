import {reserveProviderCall,remainingProviderTime} from './pilotSecurity.mjs';
// Provider failures are classified server-side. Never log/return provider bodies,
// Authorization headers, prompts, learner responses, or credential fragments.
const TRANSIENT=new Set([429,500,502,503,504]);
export class OpenAIServiceError extends Error {
 constructor(code){super('Jeremiah’s teaching service is temporarily unavailable. Please retry shortly.');this.name='OpenAIServiceError';this.code=code;this.status=503;}
}
export function configuredModel(kind){
 const value=process.env[kind==='deep'?'JEREMIAH_OPENAI_MODEL_DEEP':'JEREMIAH_OPENAI_MODEL_FAST'];
 if(!value||!/^[-a-zA-Z0-9._:]{1,100}$/.test(value))throw new OpenAIServiceError('model_not_configured');
 return value;
}
export async function openAIRequest(url,options,{service,fetcher=fetch,reserve=reserveProviderCall,sleep=ms=>new Promise(r=>setTimeout(r,ms))}={}){
 for(let attempt=0;attempt<2;attempt++){
  await reserve({body:options.body});
  const timeout=remainingProviderTime();if(timeout<1)throw new OpenAIServiceError('network_or_timeout');
  let response;
  try{response=await fetcher(url,{...options,signal:options.signal?AbortSignal.any([options.signal,AbortSignal.timeout(timeout)]):AbortSignal.timeout(timeout)});}
  catch{
   console.warn(JSON.stringify({event:'openai_failure',service,category:'network_or_timeout',attempt:attempt+1}));
   // A timed-out request may already have been billed: do not retry it blindly.
   throw new OpenAIServiceError('network_or_timeout');
  }
  if(response.ok)return response;
  const category=response.status===401?'authentication':response.status===403?'permission':response.status===404?'model_unavailable':response.status===429?'quota_or_rate_limit':response.status>=500?'provider_unavailable':'request_rejected';
  let upstreamCode=null,parameter=null;
  try{const data=await response.json();const code=data?.error?.code,param=data?.error?.param;if(['invalid_api_key','insufficient_quota','model_not_found','unsupported_parameter','rate_limit_exceeded','invalid_request_error'].includes(code))upstreamCode=code;if(['model','max_output_tokens','text.format','instructions','voice'].includes(param))parameter=param;}catch{}
  console.warn(JSON.stringify({event:'openai_failure',service,status:response.status,category,upstreamCode,parameter,attempt:attempt+1}));
  // Retry bounded transient HTTP failures only. Never retry auth/model failures.
  const retryAfter=Number(response.headers?.get?.('retry-after')||0);
  if(attempt===0&&TRANSIENT.has(response.status)&&retryAfter<=1){await sleep(Math.max(250,retryAfter*1000));continue;}
  throw new OpenAIServiceError(category);
 }
}

export function logResponseUsage(service,data){
 const input=Number(data?.usage?.input_tokens),output=Number(data?.usage?.output_tokens);
 if(Number.isSafeInteger(input)&&input>=0&&Number.isSafeInteger(output)&&output>=0)console.info(JSON.stringify({event:'openai_usage',service,inputTokens:input,outputTokens:output}));
}
