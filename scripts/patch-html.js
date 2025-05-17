const fs = require('fs');
const path = require('path');

function patchHtml(distHtmlPath, jsPath) {
  let html = fs.readFileSync(distHtmlPath, 'utf8');
  // Replace the script src to point to the built JS
  html = html.replace(
    /<script type="module" src="\.\/Popup\.tsx"><\/script>/,
    `<script type="module" src="../../popup/popup.js"></script>`
  );
  html = html.replace(
    /<script type="module" src="\.\/Options\.tsx"><\/script>/,
    `<script type="module" src="../../options/options.js"></script>`
  );
  // Replace the CSS href to point to the local styles.css
  html = html.replace(
    /<link rel="stylesheet" href="styles\.css" \/>/g,
    '<link rel="stylesheet" href="styles.css" />'
  );
  fs.writeFileSync(distHtmlPath, html, 'utf8');
}

patchHtml(
  path.join(__dirname, '../dist/pages/popup/index.html'),
  '../../popup/popup.js'
);
patchHtml(
  path.join(__dirname, '../dist/pages/options/index.html'),
  '../../options/options.js'
);
