const origin='https://ae-sponsorship-2627.thedudeundernames290.chatgpt.site';
module.exports=async(req,res)=>{
 if(req.method!=='GET')return res.status(405).end();
 const key=req.query.key;if(typeof key!=='string'||!/^(covers|photos)\/[a-f0-9-]{36}$/.test(key))return res.status(400).end();
 try{const r=await fetch(origin+'/api/media?key='+encodeURIComponent(key),{signal:AbortSignal.timeout(10000)});if(!r.ok)return res.status(r.status).end();res.setHeader('Content-Type',r.headers.get('content-type')||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','public, max-age=3600');return res.status(200).send(Buffer.from(await r.arrayBuffer()));}catch{return res.status(502).end();}
};
