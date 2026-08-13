(() => {
  const $ = id => document.getElementById(id);
  const hero = $('heroPreview');
  const frame = $('previewFrame');
  const patternName = $('patternName');
  const image = $('mediaImage');
  const video = $('mediaVideo');
  const toast = $('toast');

  const patternLabels = {split:'Hero 01 — Split',centered:'Hero 02 — Centered',background:'Hero 03 — Background Media',product:'Hero 04 — Product',editorial:'Hero 05 — Editorial',minimal:'Hero 06 — Minimal'};
  const defaults = {pattern:'split',eyebrow:'BUILT WITH LANDARY',showEyebrow:true,heading:'Build landing pages that feel intentional.',description:'A flexible hero system with controlled options for content, layout, media, typography and motion.',showDescription:true,primaryLabel:'Get started',secondaryLabel:'Learn more',showSecondary:true,contentAlign:'left',mediaPosition:'right',sectionHeight:'large',contentWidth:'default',columnGap:64,mediaType:'graphic',mediaSource:'',mediaFit:'cover',mediaRadius:16,mediaScale:100,backgroundType:'solid',backgroundColor:'#0a0a0a',gradientColor:'#202020',gradientDirection:'135deg',textColor:'#ffffff',mutedColor:'#b8b8b8',primaryStyle:'primary',secondaryStyle:'secondary',buttonIcon:'arrow',buttonRadius:8,fontFamily:'Inter',headingWeight:'700',headingSize:72,headingLine:100,bodySize:18,paddingY:96,paddingX:64,contentSpacing:24,motion:'subtle'};
  const ids = Object.keys(defaults);
  const read=id=>{const el=$(id);if(!el)return defaults[id];if(el.type==='checkbox')return el.checked;if(el.type==='range')return Number(el.value);return el.value};
  const write=(id,v)=>{const el=$(id);if(!el)return;if(el.type==='checkbox')el.checked=!!v;else el.value=v};

  function setClass(prefix,value){[...hero.classList].filter(c=>c.startsWith(prefix)).forEach(c=>hero.classList.remove(c));hero.classList.add(prefix+value)}
  function loadFont(name){const family=(name||'Inter').trim();let link=document.getElementById('hero-google-font');if(link)link.remove();link=document.createElement('link');link.id='hero-google-font';link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(family).replace(/%20/g,'+')+':wght@400;500;600;700;800&display=swap';document.head.appendChild(link);hero.style.setProperty('--hero-font',`'${family}',Inter,sans-serif`)}
  function replay(mode=read('motion')){hero.classList.remove('motion-subtle','motion-standard');void hero.offsetWidth;if(mode!=='none')hero.classList.add('motion-'+mode)}
  function labels(s){$('gapValue').textContent=s.columnGap+'px';$('mediaRadiusValue').textContent=s.mediaRadius+'px';$('mediaScaleValue').textContent=s.mediaScale+'%';$('buttonRadiusValue').textContent=s.buttonRadius+'px';$('headingSizeValue').textContent=s.headingSize+'px';$('headingLineValue').textContent=s.headingLine+'%';$('bodySizeValue').textContent=s.bodySize+'px';$('paddingYValue').textContent=s.paddingY+'px';$('paddingXValue').textContent=s.paddingX+'px';$('contentSpacingValue').textContent=s.contentSpacing+'px'}

  function apply(){
    const s={};ids.forEach(id=>s[id]=read(id));
    setClass('pattern-',s.pattern);setClass('align-',s.contentAlign);setClass('media-',s.mediaType);setClass('height-',s.sectionHeight);setClass('width-',s.contentWidth);
    hero.classList.toggle('media-left',s.mediaPosition==='left');hero.classList.toggle('is-gradient',s.backgroundType==='gradient');
    $('previewEyebrow').textContent=s.eyebrow;$('previewEyebrow').style.display=s.showEyebrow?'block':'none';$('previewHeading').textContent=s.heading;$('previewDescription').textContent=s.description;$('previewDescription').style.display=s.showDescription?'block':'none';$('previewPrimary').childNodes[0].nodeValue=s.primaryLabel+' ';$('previewSecondary').textContent=s.secondaryLabel;$('previewSecondary').style.display=s.showSecondary?'inline-flex':'none';$('previewPrimary').querySelector('span').style.display=s.buttonIcon==='none'?'none':'inline';
    hero.style.setProperty('--hero-bg',s.backgroundColor);hero.style.setProperty('--hero-bg2',s.gradientColor);hero.style.setProperty('--hero-text',s.textColor);hero.style.setProperty('--hero-muted',s.mutedColor);hero.style.setProperty('--hero-gap',s.columnGap+'px');hero.style.setProperty('--media-radius',s.mediaRadius+'px');hero.style.setProperty('--media-scale',s.mediaScale/100);hero.style.setProperty('--button-radius',s.buttonRadius+'px');hero.style.setProperty('--hero-heading',s.headingSize+'px');hero.style.setProperty('--hero-line',s.headingLine/100);hero.style.setProperty('--hero-body',s.bodySize+'px');hero.style.setProperty('--hero-weight',s.headingWeight);hero.style.setProperty('--hero-py',s.paddingY+'px');hero.style.setProperty('--hero-px',s.paddingX+'px');hero.style.setProperty('--hero-space',s.contentSpacing+'px');
    const primary=$('previewPrimary'),secondary=$('previewSecondary');primary.className='hero-btn hero-btn--primary';secondary.className='hero-btn hero-btn--secondary';if(s.primaryStyle!=='primary')primary.classList.add('style-'+s.primaryStyle);if(s.secondaryStyle!=='secondary')secondary.classList.add('style-'+s.secondaryStyle);
    image.style.objectFit=s.mediaFit;video.style.objectFit=s.mediaFit;if(s.mediaType==='image'&&s.mediaSource)image.src=s.mediaSource;if(s.mediaType==='video'&&s.mediaSource){video.src=s.mediaSource;video.play().catch(()=>{})}
    patternName.textContent=patternLabels[s.pattern];labels(s);replay(s.motion);localStorage.setItem('landaryHeroDraft',JSON.stringify(s));
  }

  document.querySelectorAll('.viewport-switch button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.viewport-switch button').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');frame.dataset.viewport=btn.dataset.viewport}));
  ids.forEach(id=>{const el=$(id);if(!el)return;el.addEventListener(el.type==='text'||el.tagName==='TEXTAREA'||el.type==='range'||el.type==='color'?'input':'change',()=>{if(id!=='fontFamily')apply()})});
  $('fontFamily').addEventListener('change',e=>{loadFont(e.target.value);apply()});$('fontFamily').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loadFont(e.currentTarget.value);apply()}});
  $('replayMotion').addEventListener('click',()=>replay());
  $('resetHero').addEventListener('click',()=>{ids.forEach(id=>write(id,defaults[id]));loadFont(defaults.fontFamily);apply()});
  $('addHero').addEventListener('click',()=>{const config={};ids.forEach(id=>config[id]=read(id));const page=JSON.parse(localStorage.getItem('landaryPage')||'[]');page.push({type:'hero',pattern:config.pattern,config});localStorage.setItem('landaryPage',JSON.stringify(page));toast.classList.add('is-visible');setTimeout(()=>toast.classList.remove('is-visible'),1600)});
  const saved=localStorage.getItem('landaryHeroDraft');if(saved){try{const data=JSON.parse(saved);ids.forEach(id=>{if(id in data)write(id,data[id])})}catch(e){}}
  loadFont(read('fontFamily'));apply();
})();