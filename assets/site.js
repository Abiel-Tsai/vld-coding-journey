const root=document.documentElement;
const menuButton=document.querySelector('.nav-toggle');
const navigation=document.querySelector('#site-nav');
const themeButton=document.querySelector('.theme-toggle');
const themeLabel=themeButton?.querySelector('span');
const themeColor=document.querySelector('meta[name="theme-color"]');
const savedTheme=localStorage.getItem('vld-theme');
if(savedTheme==='light'||savedTheme==='dark')root.dataset.theme=savedTheme;
function currentTheme(){if(root.dataset.theme)return root.dataset.theme;return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
function updateThemeLabel(){const theme=currentTheme();if(themeLabel)themeLabel.textContent=theme;if(themeColor)themeColor.setAttribute('content',theme==='dark'?'#111214':'#f1f2f4')}
if(menuButton&&navigation){menuButton.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'Close':'Menu'});navigation.addEventListener('click',event=>{if(event.target instanceof HTMLAnchorElement){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Menu'}})}
if(themeButton){updateThemeLabel();themeButton.addEventListener('click',()=>{const next=currentTheme()==='dark'?'light':'dark';root.dataset.theme=next;localStorage.setItem('vld-theme',next);updateThemeLabel()})}
