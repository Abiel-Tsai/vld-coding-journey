(() => {
  'use strict';
  const form = document.querySelector('#reflection-form');
  if (!form) return;
  const key = 'vld-reflection-draft-v1';
  const fields = ['title', 'date', 'work', 'challenge', 'response', 'next', 'check', 'progress', 'session'];
  const status = document.querySelector('#draft-status');
  const panel = document.querySelector('#publish-panel');
  const imageInput = document.querySelector('#image-input');
  const imageList = document.querySelector('#image-list');
  const imageStatus = document.querySelector('#image-status');
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  let id = crypto.randomUUID();
  let images = [];
  let processing = false;
  let prepared = null;
  const validImage = image => image && typeof image.data === 'string' && image.data.length < 300000 && /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$/.test(image.data);
  form.elements.date.value = today;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const field of fields) if (typeof saved[field] === 'string') form.elements[field].value = saved[field];
      if (/^[a-f0-9-]{36}$/.test(saved.id)) id = saved.id;
      if (Array.isArray(saved.images)) images = saved.images.filter(validImage).slice(0,3).map(image => ({data:image.data,alt:String(image.alt||'').slice(0,300),caption:String(image.caption||'').slice(0,1000),source:String(image.source||'').slice(0,500)}));
      status.textContent = 'Your saved draft is restored. Check the journal to see whether you already published it.';
    }
  } catch { status.textContent = 'Browser storage is unavailable. Download a backup before leaving.'; }
  function sessionRules() {
    const absent = form.elements.session.value === 'absent';
    for (const field of ['challenge','response','check']) form.elements[field].required = !absent;
    document.querySelector('#absence-help').hidden = !absent;
  }
  function entry() { return {...Object.fromEntries(fields.map(field => [field,form.elements[field].value.trim()])),images}; }
  const filename = () => `${form.elements.date.value || today}-${id}.json`;
  function invalidate() { panel.hidden = true; prepared = null; }
  function save() {
    invalidate();
    try { localStorage.setItem(key,JSON.stringify({...entry(),id})); status.textContent = 'Draft and attached images saved on this device. Not sent to GitHub.'; }
    catch { status.textContent = 'Could not save this draft in browser storage. Download a backup before leaving.'; }
  }
  function renderImages() {
    imageList.replaceChildren();
    images.forEach((image,index) => {
      const card = document.createElement('fieldset'); card.className = 'image-editor';
      const legend = document.createElement('legend'); legend.textContent = `Image ${index+1}`; card.append(legend);
      const preview = document.createElement('img'); preview.src = image.data; preview.alt = image.alt || `Preview of attachment ${index+1}`; card.append(preview);
      for (const [field,labelText,placeholder,limit] of [
        ['alt','Image description (required)','Describe what is visible for someone who cannot see it.',300],
        ['caption','What this shows (required)','Explain what this screenshot proves about your learning.',1000],
        ['source','Source / acknowledgement (optional)','Problem URL, source, or help used, if applicable.',500]
      ]) {
        const label = document.createElement('label'); label.textContent = labelText;
        const input = document.createElement('input'); input.type='text'; input.maxLength=limit; input.required=field!=='source'; input.value=image[field]; input.placeholder=placeholder;
        input.addEventListener('input',()=>{image[field]=input.value;if(field==='alt')preview.alt=input.value;});
        label.append(input); card.append(label);
      }
      const remove = document.createElement('button'); remove.type='button'; remove.className='text-button'; remove.textContent=`Remove image ${index+1}`;
      remove.addEventListener('click',()=>{images.splice(index,1);renderImages();save();imageStatus.textContent='Image removed from the draft.';imageInput.focus();});
      card.append(remove);imageList.append(card);
    });
  }
  async function compress(file) {
    if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('Choose a PNG, JPG, or WebP image.');
    if (file.size>12*1024*1024) throw new Error('That image is larger than 12 MB. Export a smaller copy first.');
    let bitmap;
    try { bitmap=await createImageBitmap(file); } catch { throw new Error('That file could not be read as an image. Try exporting it as a PNG or JPG.'); }
    try {
      if (bitmap.width*bitmap.height>30000000) throw new Error('That image is too large in dimensions. Resize it below 30 megapixels first.');
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      if (!ctx) throw new Error('Image processing is unavailable in this browser. Try another browser.');
      let size=Math.min(1,2000/Math.max(bitmap.width,bitmap.height));
      for(let attempt=0;attempt<5;attempt++) {
        canvas.width=Math.max(1,Math.round(bitmap.width*size));canvas.height=Math.max(1,Math.round(bitmap.height*size));
        ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
        const data=canvas.toDataURL('image/webp',Math.max(.65,.9-attempt*.06));
        if((data.length-data.indexOf(',')-1)*.75<=220000)return {data,alt:'',caption:'',source:''};
        size*=.8;
      }
      throw new Error('This image is too detailed to fit. Crop it to the relevant part and try again.');
    } finally {bitmap.close();}
  }
  imageInput.addEventListener('change',async()=>{
    if(processing)return;
    const files=Array.from(imageInput.files);
    if(!files.length)return;
    if(files.length+images.length>3){imageStatus.textContent='You can attach up to 3 images per entry. Remove an image or choose fewer files.';imageInput.value='';return;}
    processing=true;invalidate();imageInput.disabled=true;
    const buttons=[form.querySelector('button[type="submit"]'),document.querySelector('#clear-draft'),document.querySelector('#download-draft')];
    buttons.forEach(button=>button.disabled=true);imageStatus.textContent='Preparing images…';
    try {
      const additions=[];for(const file of files)additions.push(await compress(file));
      images.push(...additions);renderImages();save();
      imageStatus.textContent='Images attached to your draft. Add descriptions and captions, and check that the previews are readable.';
    }catch(error){imageStatus.textContent=error.message;}
    finally{processing=false;imageInput.disabled=false;imageInput.value='';buttons.forEach(button=>button.disabled=false);}
  });
  form.addEventListener('input',()=>{sessionRules();save();});
  form.addEventListener('submit',event=>{
    event.preventDefault();if(processing||!form.reportValidity())return;
    const required=form.elements.session.value==='absent'?['title','date','work','next']:['title','date','work','challenge','response','next','check'];
    if(required.some(field=>!entry()[field])||images.some(image=>!image.alt.trim()||!image.caption.trim())){status.textContent='Please complete the required fields and image descriptions/captions. Spaces alone do not count.';return;}
    prepared={content:JSON.stringify(entry(),null,2)+'\n',name:filename()};
    document.querySelector('#entry-filename').textContent=prepared.name;
    document.querySelector('#entry-summary').textContent=`${entry().title} · ${entry().date} · ${images.length} image${images.length===1?'':'s'}`;
    document.querySelector('#publish-status').textContent='Ready to download. Your entry has not been published yet.';
    panel.hidden=false;panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    document.querySelector('#download-entry').focus({preventScroll:true});
  });
  function download(content,name){
    const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  document.querySelector('#download-entry').addEventListener('click',()=>{
    if(!prepared)return;download(prepared.content,prepared.name);
    document.querySelector('#publish-status').textContent='Download started. Upload this JSON file to GitHub and commit to main to publish it.';
  });
  document.querySelector('#download-draft').addEventListener('click',()=>download(JSON.stringify(entry(),null,2)+'\n',filename()));
  document.querySelector('#clear-draft').addEventListener('click',()=>{
    if(!confirm('Clear this device’s draft and attached images? Published reflections will stay in the journal.'))return;
    try{localStorage.removeItem(key);}catch{/* The form can still be cleared. */}
    form.reset();form.elements.date.value=today;id=crypto.randomUUID();images=[];invalidate();renderImages();sessionRules();
    imageStatus.textContent='';status.textContent='Draft cleared. Ready for a new entry.';form.elements.title.focus();
  });
  renderImages();sessionRules();
})();
