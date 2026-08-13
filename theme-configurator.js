(() => {
  const defaults = { color: '#faff69', font: 'Inter', radius: 12 };
  const panel = document.createElement('aside');
  panel.className = 'theme-panel';
  panel.innerHTML = `
    <div class="theme-panel__head"><div><span>THEME</span><strong>Configure Landary</strong></div><button class="theme-reset" type="button">Reset</button></div>
    <section class="theme-control">
      <div class="theme-label"><span>Brand color</span><code id="themeHex">#FAFF69</code></div>
      <label class="color-field"><input id="themeColor" type="color" value="#faff69"><span id="themeColorSwatch"></span><input id="themeHexInput" type="text" value="#FAFF69" maxlength="7"></label>
      <div class="tone-scale" id="toneScale"></div>
    </section>
    <section class="theme-control">
      <div class="theme-label"><span>Typeface</span><small>Google Fonts</small></div>
      <input class="theme-input" id="themeFont" list="googleFontSuggestions" value="Inter" placeholder="Type any Google Font">
      <datalist id="googleFontSuggestions"><option value="Inter"><option value="Roboto"><option value="Open Sans"><option value="Montserrat"><option value="Poppins"><option value="Manrope"><option value="DM Sans"><option value="Space Grotesk"><option value="Plus Jakarta Sans"><option value="Outfit"><option value="Sora"><option value="Urbanist"><option value="Work Sans"><option value="Lato"><option value="Nunito Sans"><option value="IBM Plex Sans"><option value="Bricolage Grotesque"><option value="Archivo"><option value="Rubik"><option value="Figtree"></datalist>
      <div class="font-preview" id="fontPreview"><strong>Build landing pages.</strong><span>Aa Bb Cc 123</span></div>
      <p class="theme-hint">Type any Google Fonts family and press Enter.</p>
    </section>
    <section class="theme-control">
      <div class="theme-label"><span>Corner radius</span><code id="radiusValue">12px</code></div>
      <input class="theme-range" id="themeRadius" type="range" min="0" max="28" value="12">
      <div class="radius-preview"><i></i><i></i><i></i></div>
    </section>`;
  document.body.appendChild(panel);

  const root = document.documentElement;
  const color = panel.querySelector('#themeColor');
  const swatch = panel.querySelector('#themeColorSwatch');
  const hexInput = panel.querySelector('#themeHexInput');
  const hexLabel = panel.querySelector('#themeHex');
  const scale = panel.querySelector('#toneScale');
  const fontInput = panel.querySelector('#themeFont');
  const fontPreview = panel.querySelector('#fontPreview');
  const radius = panel.querySelector('#themeRadius');
  const radiusValue = panel.querySelector('#radiusValue');

  const validHex = value => /^#[0-9a-f]{6}$/i.test(value);
  function rgb(hex){return {r:parseInt(hex.slice(1,3),16),g:parseInt(hex.slice(3,5),16),b:parseInt(hex.slice(5,7),16)}}
  function toHex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')}
  function mix(hex,target,t){const a=rgb(hex);return toHex(a.r+(target.r-a.r)*t,a.g+(target.g-a.g)*t,a.b+(target.b-a.b)*t)}
  function renderScale(hex){const stops=[['50',mix(hex,{r:255,g:255,b:255},.88)],['100',mix(hex,{r:255,g:255,b:255},.72)],['200',mix(hex,{r:255,g:255,b:255},.54)],['300',mix(hex,{r:255,g:255,b:255},.36)],['400',mix(hex,{r:255,g:255,b:255},.18)],['500',hex],['600',mix(hex,{r:0,g:0,b:0},.12)],['700',mix(hex,{r:0,g:0,b:0},.26)],['800',mix(hex,{r:0,g:0,b:0},.4)],['900',mix(hex,{r:0,g:0,b:0},.55)],['950',mix(hex,{r:0,g:0,b:0},.68)]];scale.innerHTML=stops.map(([n,v])=>`<span title="${v}"><i style="--tone:${v}"></i><small>${n}</small></span>`).join('')}
  function applyColor(hex){hex=hex.toLowerCase();if(!validHex(hex))return;root.style.setProperty('--primary',hex);color.value=hex;swatch.style.background=hex;hexInput.value=hex.toUpperCase();hexLabel.textContent=hex.toUpperCase();renderScale(hex)}
  function loadFont(name){const family=name.trim();if(!family)return;let link=document.getElementById('landary-google-font');if(link)link.remove();link=document.createElement('link');link.id='landary-google-font';link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(family).replace(/%20/g,'+')+':wght@400;500;600;700&display=swap';document.head.appendChild(link);document.body.style.fontFamily=`'${family}',Inter,sans-serif`;fontPreview.style.fontFamily=`'${family}',Inter,sans-serif`}
  function applyRadius(value){root.style.setProperty('--radius',value+'px');radiusValue.textContent=value+'px';document.querySelectorAll('.section-card,.card-visual,.flow-card').forEach(el=>el.style.borderRadius=value+'px')}

  color.addEventListener('input',e=>applyColor(e.target.value));
  hexInput.addEventListener('change',e=>{let v=e.target.value.trim();if(!v.startsWith('#'))v='#'+v;applyColor(v)});
  fontInput.addEventListener('change',e=>loadFont(e.target.value));
  fontInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loadFont(e.currentTarget.value)}});
  radius.addEventListener('input',e=>applyRadius(e.target.value));
  panel.querySelector('.theme-reset').addEventListener('click',()=>{applyColor(defaults.color);fontInput.value=defaults.font;loadFont(defaults.font);radius.value=defaults.radius;applyRadius(defaults.radius)});
  applyColor(defaults.color); loadFont(defaults.font); applyRadius(defaults.radius);
})();