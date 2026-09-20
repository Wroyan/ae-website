const origin='https://ae-sponsorship-2627.thedudeundernames290.chatgpt.site';
module.exports=async(req,res)=>{
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{const r=await fetch(origin+'/api/content',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();const data=await r.json();res.setHeader('Cache-Control','no-store');return res.status(200).json({recaps:data.recaps||[],photos:data.photos||[],canEdit:false});}catch{return res.status(502).json({error:'Updates are temporarily unavailable.'});}
};
