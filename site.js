'use strict';
const mediaURL = value => typeof value === 'string' && /^\/api\/media\?key=(covers|photos)(%2F|\/)[a-f0-9-]{36}$/i.test(value) ? value : null;
const webURL = value => {try {const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
async function loadContent(){
 const grid=document.querySelector('.monthly-grid'),gallery=document.querySelector('.photo-collage');
 if(!grid&&!gallery)return;
 try{
  const r=await fetch('/api/content');if(!r.ok)throw Error();const data=await r.json();
  if(grid)for(const card of grid.children){
   const heading=card.querySelector('h2'),month=heading.textContent.split(':')[0];
   const recap=(data.recaps||[]).find(x=>x.month===month);if(!recap)continue;
   const link=webURL(recap.emailUrl);if(link){const a=document.createElement('a');a.href=link;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Read email ↗';heading.replaceChildren(document.createTextNode(month+': '),a);}
   const src=mediaURL(recap.coverUrl);if(src){const img=document.createElement('img');img.src=src;img.alt=month+' recap cover';img.className='recap-cover';card.querySelector('.cover-placeholder')?.replaceWith(img);}
  }
  if(gallery){gallery.replaceChildren();for(const photo of data.photos||[]){const src=mediaURL(photo.url);if(!src)continue;const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=src;img.alt=photo.caption||'Community giveback';img.loading='lazy';caption.textContent=photo.caption;figure.append(img,caption);gallery.append(figure);}if(!gallery.children.length){const p=document.createElement('p');p.className='gallery-empty';p.textContent='Community giveback photos are coming soon.';gallery.append(p);}}
 }catch{const p=document.createElement('p');p.setAttribute('role','status');p.textContent='Updates are temporarily unavailable. Please try again later.';(grid||gallery).before(p);}
}
void loadContent();
const form=document.querySelector('.signup-form');
if(form)form.addEventListener('submit',async event=>{
 event.preventDefault();const values=new FormData(form),button=form.querySelector('button'),status=form.querySelector('[role="status"]');button.disabled=true;status.textContent='Saving…';
 try{const r=await fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:values.get('name'),email:values.get('email'),consent:values.get('consent')==='on'})});const result=await r.json();if(!r.ok)throw Error(result.error||'Could not save your request. Please try again.');status.textContent=result.message;form.reset();}catch(e){status.textContent=e.message||'Could not save your request. Please try again.';}finally{button.disabled=false;}
});
