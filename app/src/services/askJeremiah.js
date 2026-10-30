export async function askJeremiah(question,history=[],signal) {
 const response=await fetch("/api/jeremiah/ask",{
  method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({question,history}),signal
 });
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data.error||"Ask Jeremiah is unavailable right now.");
 return data;
}
