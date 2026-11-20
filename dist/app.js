const filters = [...document.querySelectorAll('[data-filter]')];
const products = [...document.querySelectorAll('[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  products.forEach(product => {
    product.hidden = button.dataset.filter !== 'todos' && product.dataset.category !== button.dataset.filter;
    if (!product.hidden) count++;
  });
  document.querySelector('#filter-status').textContent = `${count} confecciones en ${button.textContent}.`;
}));

const drawer = document.querySelector('#quote-drawer');
const triggers = [...document.querySelectorAll('[data-open-quote]')];
let selectedService = 'Uniforme escolar a medida';
const messageField = document.querySelector('#message');
const whatsappLink = document.querySelector('#whatsapp-link');

function updateRequest() {
  const details = messageField.value.trim();
  const message = 'Hola Nathy. Quisiera cotizar un uniforme del Colegio San Ignacio de Calera de Tango: ' + selectedService + '.' + (details ? '\n\n' + details : '');
  document.querySelector('#selected-service').textContent = selectedService;
  whatsappLink.href = 'https://wa.me/56994767883?text=' + encodeURIComponent(message);
}
triggers.forEach(trigger => trigger.addEventListener('click', () => {
  if (trigger.dataset.product) selectedService = trigger.dataset.product;
  else selectedService = 'Uniforme escolar a medida';
  updateRequest();
  drawer.showModal();
  document.documentElement.classList.add('drawer-open');
  triggers.forEach(item => item.setAttribute('aria-expanded', 'true'));
}));
document.querySelector('#close-drawer').addEventListener('click', () => drawer.close());
drawer.addEventListener('click', event => {
  if (event.target !== drawer) return;
  const rect = drawer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) drawer.close();
});
drawer.addEventListener('close', () => {
  document.documentElement.classList.remove('drawer-open');
  triggers.forEach(item => item.setAttribute('aria-expanded', 'false'));
});
messageField.addEventListener('input', updateRequest);
updateRequest();
document.querySelector('#year').textContent = new Date().getFullYear();

const productDialog = document.querySelector('#product-dialog');
const zoomStage = document.querySelector('#zoom-stage');
const zoomButton = document.querySelector('#toggle-zoom');
const productDescriptions = {
  'Buzo completo': 'Buzo completo para estudiantes del Colegio San Ignacio de Calera de Tango. Chaqueta con cierre en azul marino, rojo y gris, junto a pantalón azul marino con detalles rojos, según el modelo del catálogo. Lo confeccionamos a medida para acompañar con comodidad la jornada escolar.',
  'Polera blanca': 'Polera blanca del uniforme del Colegio San Ignacio de Calera de Tango, con cuello y detalles rojos y azul marino según el modelo del catálogo. Una prenda para el día a día escolar, confeccionada según las medidas de cada estudiante.',
  'Polera deportiva': 'Polera de educación física para estudiantes del Colegio San Ignacio de Calera de Tango. Su diseño negro incorpora detalles rojos y amarillos en los hombros, según el catálogo. La confeccionamos a medida para que cada estudiante pueda moverse con comodidad.',
  'Polerón con capucha': 'Polerón azul marino para complementar el uniforme del Colegio San Ignacio de Calera de Tango. El modelo del catálogo incluye capucha y bolsillo delantero. Confección a medida, también para estudiantes de tallas grandes.',
  'Jockey escolar': 'Jockey azul marino para complementar el uniforme del Colegio San Ignacio de Calera de Tango, según el diseño del catálogo. Consulta por las medidas y los detalles de confección de tu pedido.'
};
let viewedProduct = '';
function resetZoom() {
  zoomStage.classList.remove('is-zoomed');
  zoomButton.setAttribute('aria-pressed', 'false');
  zoomButton.textContent = 'Ampliar imagen';
  document.querySelector('#zoom-help').textContent = 'Mira los detalles de la prenda.';
  zoomStage.scrollTop = 0;
  zoomStage.scrollLeft = 0;
}
document.querySelectorAll('[data-view-product]').forEach(button => button.addEventListener('click', () => {
  viewedProduct = button.dataset.viewProduct;
  const image = button.closest('article').querySelector('.product-visual img').cloneNode(true);
  image.querySelectorAll('[id]').forEach(node => { const oldId = node.id; node.id = 'detail-' + oldId; image.querySelectorAll('[clip-path]').forEach(clipped => { if (clipped.getAttribute('clip-path') === 'url(#' + oldId + ')') clipped.setAttribute('clip-path', 'url(#detail-' + oldId + ')'); }); });
  document.querySelector('#product-image').replaceChildren(image);
  document.querySelector('#product-title').textContent = viewedProduct;
  document.querySelector('#product-description').textContent = productDescriptions[viewedProduct];
  resetZoom();
  productDialog.showModal();
  document.documentElement.classList.add('drawer-open');
}));
zoomButton.addEventListener('click', () => {
  const zoomed = zoomStage.classList.toggle('is-zoomed');
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? 'Ver imagen completa' : 'Ampliar imagen';
  document.querySelector('#zoom-help').textContent = zoomed ? 'Desplaza la imagen para ver sus detalles.' : 'Mira los detalles de la prenda.';
  if (!zoomed) { zoomStage.scrollTop = 0; zoomStage.scrollLeft = 0; }
});
document.querySelector('#close-product').addEventListener('click', () => productDialog.close());
productDialog.addEventListener('click', event => {
  if (event.target !== productDialog) return;
  const rect = productDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) productDialog.close();
});
productDialog.addEventListener('close', () => {
  if (!drawer.open) document.documentElement.classList.remove('drawer-open');
});
document.querySelector('#quote-product').addEventListener('click', () => {
  selectedService = viewedProduct;
  updateRequest();
  productDialog.close();
  drawer.showModal();
  document.documentElement.classList.add('drawer-open');
  triggers.forEach(item => item.setAttribute('aria-expanded', 'true'));
});

// Keep both supplied models available without automatic movement.
const modelButtons = [...document.querySelectorAll('[data-model]')];
modelButtons.forEach(button => button.addEventListener('click', () => {
  const girl = button.dataset.model === 'chica';
  document.querySelector('#hero-model-image').setAttribute('src', girl ? 'assets/modelo-chica.png' : 'assets/modelo-chico.png');
  document.querySelector('#hero-model-image').setAttribute('alt', (girl ? 'Chica' : 'Chico') + ' con el buzo del Colegio San Ignacio de Calera de Tango, confeccionado por nathycostura.cl');
  modelButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#model-status').textContent = 'Mostrando uniforme en ' + button.dataset.model + '.';
}));
