const origin='https://ae-sponsorship-2627.thedudeundernames290.chatgpt.site';
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 try{
  if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'Please submit from this website.'});
  const data=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!data||typeof data.name!=='string'||!data.name.trim()||data.name.length>100||typeof data.email!=='string'||data.email.length>254||!/^\S+@\S+\.\S+$/.test(data.email)||data.consent!==true)return res.status(400).json({error:'Please enter your name, a valid email, and check the consent box.'});
  const r=await fetch(origin+'/api/subscribers',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({name:data.name,email:data.email,consent:true}),signal:AbortSignal.timeout(10000)});
  const result=await r.json();return res.status(r.status).json(r.ok?{ok:true,message:result.message}:{error:result.error||'Could not save your request.'});
 }catch{return res.status(502).json({error:'Could not save your request. Please try again later.'});}
};
