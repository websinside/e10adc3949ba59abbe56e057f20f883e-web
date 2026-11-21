import {readFile,writeFile} from 'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
await writeFile('dist/colegios.htm',html.replace('<body data-mobile-view="inicio"','<body data-school-page="true" data-mobile-view="colegios"').replace(/<title>[^<]*<\/title>/,'<title>Colegios y uniformes | nathycostura.cl</title>'));
