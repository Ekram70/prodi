function d(o){const t=document.getElementById("prodi-toast");t&&t.remove();const e=document.createElement("div");e.id="prodi-toast",e.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `,e.textContent=o,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="1"},100),setTimeout(()=>{e.style.opacity="0",setTimeout(()=>{e.remove()},300)},3e3)}async function i(){var o;try{const t=await chrome.storage.sync.get("settings"),e=(o=t.settings)==null?void 0:o.bedtime;if(!t.settings||!e){s();return}if(!e.enabled){s();return}const c=new Date,n=c.getHours()*60+c.getMinutes(),[l,p]=e.startTime.split(":").map(Number),[y,u]=e.endTime.split(":").map(Number),r=l*60+p,a=y*60+u;r>a?n>=r||n<a?(m(),d("Bedtime mode is active")):s():n>=r&&n<a?(m(),d("Bedtime mode is active")):s()}catch(t){console.error("Error checking bedtime mode:",t),s()}}function m(){if(!document.getElementById("prodi-grayscale-style")){const t=document.createElement("style");t.id="prodi-grayscale-style",t.textContent=`
      html {
        filter: grayscale(100%) !important;
        -webkit-filter: grayscale(100%) !important;
      }
    `,document.head.appendChild(t)}}function s(){const o=document.getElementById("prodi-grayscale-style");o&&o.remove()}document.addEventListener("DOMContentLoaded",()=>{i()});i();chrome.storage.onChanged.addListener(o=>{o.settings&&i()});setInterval(i,6e4);
