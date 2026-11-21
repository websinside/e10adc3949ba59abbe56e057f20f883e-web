import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const core = ['index.html','colegios.htm','offline.html','styles.css','app.js','pwa.js','manifest.webmanifest','assets/pwa/icon-180.png','assets/pwa/icon-192.png','assets/pwa/icon-512.png','assets/logo-icono.webp','assets/logo-horizontal.webp'];
const hash = createHash('sha256');
for (const file of core) hash.update(await readFile('dist/' + file));
const version = hash.digest('hex').slice(0,16);
const template = await readFile('src/sw-template.js','utf8');
await writeFile('dist/sw.js', template.replace('__VERSION__', version).replace('__CORE__', JSON.stringify(core)));
