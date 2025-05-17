async function i(){var e;try{const t=await chrome.storage.sync.get("settings"),s=(e=t.settings)==null?void 0:e.bedtime;if(!t.settings||!s){n();return}if(!s.enabled){n();return}const c=new Date,r=c.getHours()*60+c.getMinutes(),[d,m]=s.startTime.split(":").map(Number),[y,g]=s.endTime.split(":").map(Number),o=d*60+m,a=y*60+g;o>a?r>=o||r<a?l():n():r>=o&&r<a?l():n()}catch(t){console.error("Error checking bedtime mode:",t),n()}}function l(){if(!document.getElementById("prodi-grayscale-style")){const t=document.createElement("style");t.id="prodi-grayscale-style",t.textContent=`
      html {
        filter: grayscale(100%) !important;
        -webkit-filter: grayscale(100%) !important;
      }
    `,document.head.appendChild(t)}}function n(){const e=document.getElementById("prodi-grayscale-style");e&&e.remove()}document.addEventListener("DOMContentLoaded",()=>{i()});i();chrome.storage.onChanged.addListener(e=>{e.settings&&i()});setInterval(i,6e4);
