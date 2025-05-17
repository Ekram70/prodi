async function a(){var c;const e=(c=(await chrome.storage.sync.get("settings")).settings)==null?void 0:c.bedtime;if(!(e!=null&&e.enabled)){r();return}const o=new Date,n=o.getHours()*60+o.getMinutes(),[m,d]=e.startTime.split(":").map(Number),[y,g]=e.endTime.split(":").map(Number),s=m*60+d,i=y*60+g;s>i?n>=s||n<i?l():r():n>=s&&n<i?l():r()}function l(){if(!document.getElementById("prodi-grayscale-style")){const e=document.createElement("style");e.id="prodi-grayscale-style",e.textContent=`
      html {
        filter: grayscale(100%) !important;
        -webkit-filter: grayscale(100%) !important;
      }
    `,document.head.appendChild(e)}}function r(){const t=document.getElementById("prodi-grayscale-style");t&&t.remove()}a();chrome.storage.onChanged.addListener(t=>{t.settings&&a()});setInterval(a,6e4);
