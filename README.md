# Nathy Confecciones

Web estática con Tailwind CSS 4 compilado, JavaScript y HTML semántico. No requiere un servidor de aplicaciones ni una base de datos.

## Trabajar localmente

```sh
npm install
npm run build
npm run dev
```

Abre http://127.0.0.1:4173. Para recompilar estilos mientras editas, ejecuta `npm run watch` en otra terminal.

- `dist/index.html`: contenido, secciones y clases Tailwind.
- `src/styles.css`: tema, fuentes y componentes de estilo.
- `dist/app.js`: filtros de productos, panel lateral accesible y preparación de consultas por WhatsApp.
- `dist/assets/uniformes-nathy.png`: afiche proporcionado por la clienta. Los productos se muestran mediante recortes visuales SVG del mismo afiche.
- `dist/styles.css`: CSS compilado. Edita el archivo fuente y ejecuta el build.

El teléfono configurado es +56 9 9476 7883. El panel lateral prepara un mensaje y abre WhatsApp; no envía datos a un servidor ni confirma pedidos. No se inventaron precios, dirección, horarios ni plazos de entrega.

## Publicación

La carpeta pública es `dist`. `.openai/hosting.json` conserva la identidad de Sites. La publicación inicial es privada en Sites. El dominio nathycostura.cl requiere configuración de dominio por separado.

Las fichas de los uniformes del Colegio San Ignacio de Calera de Tango abren un modal con descripción, confección a medida e imagen ampliable al 200 %. El botón flotante abre WhatsApp directamente; el panel lateral permite cotizar la prenda seleccionada sin datos obligatorios.

Las fotos de modelos y productos son archivos PNG independientes extraídos de los afiches originales. Para reproducirlos en Windows, ejecuta `./scripts/crop-catalog.ps1`. El selector Chica/Chico cambia la foto de portada; las fichas usan las prendas recortadas.
