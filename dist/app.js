const filters = [...document.querySelectorAll('[data-filter]')];
const products = [...document.querySelectorAll('[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  products.forEach(product => {
    product.hidden = (button.dataset.filter !== 'todos' && product.dataset.category !== button.dataset.filter) || !matchesSelectedSchool(product);
    if (!product.hidden) count++;
  });
  document.querySelector('#filter-status').textContent = `${count} confecciones en ${button.textContent.trim()}.`;
}));

const drawer = document.querySelector('#quote-drawer');
const triggers = [...document.querySelectorAll('[data-open-quote]')];
const quickChips = [...document.querySelectorAll('[data-quick-note]')];
let selectedService = 'Uniforme escolar a medida';
let selectedType = 'uniforme';
let selectedNote = '';
const messageField = document.querySelector('#message');
const whatsappLink = document.querySelector('#whatsapp-link');

function buildWhatsappMessage() {
  const details = messageField.value.trim();
  const base = selectedType === 'servicio'
    ? `Hola Nathy. Quisiera cotizar el servicio de: ${selectedService}.`
    : `Hola Nathy. Quisiera cotizar (${selectedService}) para uniforme escolar.`;
  const extras = [selectedNote, details].filter(Boolean).join('\n');
  return extras ? `${base}\n\n${extras}` : base;
}

function updateRequest() {
  document.querySelector('#selected-service').textContent = selectedService;
  whatsappLink.href = 'https://wa.me/56994767883?text=' + encodeURIComponent(buildWhatsappMessage());
}

function openQuoteDrawer(service, type = 'uniforme') {
  selectedService = service || 'Uniforme escolar a medida';
  selectedType = type;
  updateRequest();
  drawer.showModal();
  document.documentElement.classList.add('drawer-open');
  triggers.forEach(item => item.setAttribute('aria-expanded', 'true'));
}

triggers.forEach(trigger => trigger.addEventListener('click', () => {
  openQuoteDrawer(trigger.dataset.product, trigger.dataset.quoteType || 'uniforme');
}));

quickChips.forEach(chip => chip.addEventListener('click', () => {
  const isActive = chip.getAttribute('aria-pressed') === 'true';
  quickChips.forEach(item => item.setAttribute('aria-pressed', 'false'));
  if (!isActive) {
    chip.setAttribute('aria-pressed', 'true');
    selectedNote = chip.dataset.quickNote;
  } else {
    selectedNote = '';
  }
  updateRequest();
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
'Delantal de jardín modelo 1': 'Delantal infantil con cuerpo azul, mangas rojas, pechera amarilla, cuello verde y bolsillo delantero amarillo. Botones al frente. Usa Girar para ver la espalda.',
'Delantal de jardín modelo 2': 'Delantal infantil azul con mangas rojas, cuello verde y terminaciones amarillas. Este modelo tiene botones en la espalda. Usa Girar para ver ambas vistas.',
"Buzo completo El Roto Chileno": "Chaqueta azul marino con diseño rojo en V y pantalón con franjas rojas. Uniforme para estudiantes de la Escuela El Roto Chileno de Talagante. Consulta por tu talla y confección a medida.",
"Polera El Roto Chileno": "Polera roja con cuello azul marino e insignia de El Roto Chileno. Uniforme para estudiantes de la Escuela El Roto Chileno de Talagante. Consulta por tu talla y confección a medida.",
"Polerón El Roto Chileno": "Polerón rojo con capucha, cierre y terminaciones azul marino. Uniforme para estudiantes de la Escuela El Roto Chileno de Talagante. Consulta por tu talla y confección a medida.",
  'Polera Colegio Calera de Tango': 'Polera amarilla del Colegio Calera de Tango, con cuello y puños azul marino, botones oscuros e insignia del establecimiento. Consulta por la confección a medida, las tallas y los detalles de tu pedido.',
  'Buzo completo': 'Buzo completo para estudiantes del Colegio San Ignacio de Calera de Tango. Chaqueta con cierre en azul marino, rojo y gris, junto a pantalón azul marino con detalles rojos, según el modelo del catálogo. Lo confeccionamos a medida para acompañar con comodidad toda la jornada escolar.',
  'Polera blanca': 'Polera blanca del uniforme del Colegio San Ignacio de Calera de Tango, con cuello y detalles rojos y azul marino según el modelo del catálogo. Una prenda pensada para el uso diario, confeccionada según las medidas de cada estudiante.',
  'Polera deportiva': 'Polera de educación física para estudiantes del Colegio San Ignacio de Calera de Tango. Su diseño negro incorpora detalles rojos y amarillos en los hombros, según el catálogo. Confeccionada a medida para moverse con comodidad.',
  'Polerón con capucha': 'Polerón azul marino para complementar el uniforme del Colegio San Ignacio de Calera de Tango. El modelo del catálogo incluye capucha y bolsillo delantero. Confección a medida, también disponible en tallas grandes.',
  'Jockey escolar': 'Jockey azul marino para complementar el uniforme del Colegio San Ignacio de Calera de Tango, según el diseño del catálogo. Consulta por disponibilidad, medidas y detalles de confección de tu pedido.'
};
let viewedProduct = '';
function resetZoom() {
  zoomStage.classList.remove('is-zoomed');
  zoomButton?.setAttribute('aria-pressed', 'false');
  if(zoomButton) zoomButton.textContent = 'Ampliar imagen';
  document.querySelector('#zoom-help').textContent = 'Mira los detalles de la prenda.';
  zoomStage.scrollTop = 0;
  zoomStage.scrollLeft = 0;
}
document.querySelectorAll('[data-view-product]').forEach(button => button.addEventListener('click', () => {
  viewedProduct = button.dataset.viewProduct;
  const isCalera = viewedProduct === 'Polera Colegio Calera de Tango';
  const isRoto = viewedProduct.includes('El Roto Chileno');
  const isJardin = viewedProduct.startsWith('Delantal de jardín');
  document.querySelector('#product-school').textContent = isJardin ? 'Jardín infantil' : isRoto ? 'Escuela El Roto Chileno · Talagante' : isCalera ? 'Colegio Calera de Tango' : 'San Ignacio · Calera de Tango';
  document.querySelector('#product-school-description').textContent = isJardin ? 'Confección para niños de jardín infantil.' : isRoto ? 'Para estudiantes de la Escuela El Roto Chileno de Talagante.' : isCalera ? 'Para estudiantes del Colegio Calera de Tango.' : 'Para estudiantes del Colegio San Ignacio de Calera de Tango.';
  const image = button.closest('article').querySelector('.product-visual img').cloneNode(true);
  image.querySelectorAll('[id]').forEach(node => {
    const oldId = node.id;
    node.id = 'detail-' + oldId;
    image.querySelectorAll('[clip-path]').forEach(clipped => {
      if (clipped.getAttribute('clip-path') === 'url(#' + oldId + ')') clipped.setAttribute('clip-path', 'url(#detail-' + oldId + ')');
    });
  });
  document.querySelector('#product-image').replaceChildren(image);
  configureProductTurn(image);
  document.querySelector('#product-title').textContent = viewedProduct;
  document.querySelector('#product-description').textContent = productDescriptions[viewedProduct];
  resetZoom();
  productDialog.showModal();
  document.documentElement.classList.add('drawer-open');
}));
zoomButton?.addEventListener('click', () => {
  const zoomed = zoomStage.classList.toggle('is-zoomed');
  zoomButton?.setAttribute('aria-pressed', String(zoomed));
  if(zoomButton) zoomButton.textContent = zoomed ? 'Ver imagen completa' : 'Ampliar imagen';
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
  productDialog.close();
  openQuoteDrawer(viewedProduct, 'uniforme');
});

// Three-image carousel with buttons, keyboard navigation and touch swipe.
const carousel = document.querySelector('#hero-carousel');
const slideDots = [...document.querySelectorAll('[data-slide]')];
let currentSlide = 0;
function showSlide(index) {
  currentSlide = (index + slideDots.length) % slideDots.length;
  document.querySelector('#slide-school').textContent = carousel.querySelectorAll('.slide-photo')[currentSlide].dataset.school;
  document.querySelector('#model-track').style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  slideDots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === currentSlide)));
  document.querySelectorAll('.slide-photo').forEach((photo, i) => photo.setAttribute('aria-hidden', String(i !== currentSlide)));
  document.querySelector('#model-status').textContent = 'Imagen ' + (currentSlide + 1) + ' de ' + slideDots.length + '.';
}
slideDots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide))));
document.querySelector('#previous-slide').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('#next-slide').addEventListener('click', () => showSlide(currentSlide + 1));
carousel.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    showSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let swipeStart;
carousel.addEventListener('pointerdown', event => {
  swipeStart = event.pointerType === 'touch' ? { x: event.clientX, y: event.clientY } : null;
});
carousel.addEventListener('pointerup', event => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showSlide(currentSlide + (dx < 0 ? 1 : -1));
  swipeStart = null;
});
carousel.addEventListener('pointercancel', () => { swipeStart = null; });
showSlide(0);

const turnButton = document.querySelector('#turn-product');
const productImageBox = document.querySelector('#product-image');
let frontSource = '', backSource = '', showingBack = false;
let turning = false, turnVersion = 0;
function configureProductTurn(image) {
  turnVersion++;
  turning = false;
  turnButton.disabled = false;
  frontSource = image.getAttribute('src');
  backSource = image.dataset.backSrc || '';
  showingBack = false;
  turnButton.hidden = !backSource;
  turnButton.setAttribute('aria-pressed','false');
  turnButton.textContent = 'Girar · Ver espalda';
  if(backSource) {
    productImageBox.setAttribute('role','button'); productImageBox.setAttribute('tabindex','0'); productImageBox.setAttribute('aria-label','Girar prenda para ver la espalda');
    const preload = new Image(); preload.src = backSource;
  } else { ['role','tabindex','aria-label'].forEach(attr=>productImageBox.removeAttribute(attr)); }
}
async function turnProduct() {
  if(!backSource || turning) return;
  const version = turnVersion;
  const image = productImageBox.querySelector('img');
  const nextBack = !showingBack;
  const nextSource = nextBack ? backSource : frontSource;
  turning = true;
  turnButton.disabled = true;
  try {
    const ready = new Image(); ready.src = nextSource;
    await ready.decode();
    if(version !== turnVersion || !productDialog.open) return;
    resetZoom();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reducedMotion) {
      await image.animate([
        {transform:'perspective(1000px) rotateY(0deg)',opacity:1},
        {transform:'perspective(1000px) rotateY(90deg)',opacity:.35}
      ],{duration:180,easing:'cubic-bezier(.55,0,1,.45)',fill:'forwards'}).finished;
    }
    if(version !== turnVersion || !productDialog.open) { image.getAnimations().forEach(animation=>animation.cancel()); return; }
    showingBack = nextBack;
    image.src = nextSource;
    image.alt = viewedProduct + (showingBack ? ', vista de espalda' : ', vista de frente');
    turnButton.setAttribute('aria-pressed',String(showingBack));
    turnButton.textContent = showingBack ? 'Girar · Ver frente' : 'Girar · Ver espalda';
    productImageBox.setAttribute('aria-label',showingBack ? 'Girar prenda para ver el frente' : 'Girar prenda para ver la espalda');
    image.getAnimations().forEach(animation=>animation.cancel());
    if(!reducedMotion) {
      await image.animate([
        {transform:'perspective(1000px) rotateY(-90deg)',opacity:.35},
        {transform:'perspective(1000px) rotateY(0deg)',opacity:1}
      ],{duration:240,easing:'cubic-bezier(.16,1,.3,1)'}).finished;
    }
  } catch {
    image.getAnimations().forEach(animation=>animation.cancel());
  } finally {
    if(version === turnVersion) { turning = false; turnButton.disabled = false; }
  }
}
turnButton.addEventListener('click',turnProduct);
productImageBox.addEventListener('click',turnProduct);
productImageBox.addEventListener('keydown',event=>{if(backSource && (event.key==='Enter'||event.key===' ')){event.preventDefault();turnProduct();}});

// Mobile-only views; desktop retains the complete page.
const mobileLayout = window.matchMedia('(max-width: 47.999rem)');
const mobileScreenButtons = [...document.querySelectorAll('.mobile-bottom-nav [data-mobile-screen]')];
function setMobileScreen(screen, scroll = true) {
  document.body.dataset.mobileView = screen;
  mobileScreenButtons.forEach(button => {
    if(button.dataset.mobileScreen === screen) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
  if(scroll) window.scrollTo({top:0,behavior:'instant'});
}
mobileScreenButtons.forEach(button => button.addEventListener('click',()=>{
  if(!mobileLayout.matches) return;
  location.href=button.dataset.mobileScreen==='colegios'?'colegios.htm':'./';
}));
document.addEventListener('click',event=>{
  if(!mobileLayout.matches) return;
  const link=event.target.closest('a[href^="#"]');
  if(!link) return;
  const hash=link.getAttribute('href');
  if(hash==='#colegios'||hash==='#uniformes') { event.preventDefault(); location.href='colegios.htm'; return; }
  if(document.body.dataset.schoolPage) { event.preventDefault(); location.href='./'+hash; return; }
  const target=hash.length>1 ? document.getElementById(hash.slice(1)) : document.getElementById('contenido');
  if(!target) return;
  const panel=target.closest('[data-mobile-panel]');
  const screen=panel ? panel.dataset.mobilePanel : 'inicio';
  setMobileScreen(screen,false);
});
function syncMobileHash() {
  if(!mobileLayout.matches) return;
  const target=document.getElementById(location.hash.slice(1));
  const panel=target?.closest('[data-mobile-panel]');
  if(panel) setMobileScreen(panel.dataset.mobilePanel,false);
}
window.addEventListener('hashchange',syncMobileHash);
mobileLayout.addEventListener('change',syncMobileHash);
syncMobileHash();

function matchesSelectedSchool(product) {
  const school=new URLSearchParams(location.search).get('colegio');
  return !window.matchMedia('(max-width: 47.999rem)').matches || !document.body.dataset.schoolPage || !school || school==='todos' || product.dataset.schoolId===school;
}
function showSchoolSelection() {
  if(!document.body.dataset.schoolPage) return;
  const school=new URLSearchParams(location.search).get('colegio');
  const choice=[...document.querySelectorAll('[data-select-school]')].find(button=>button.dataset.selectSchool===school);
  document.body.dataset.schoolSelected=choice?'true':'false';
  if(choice) {
    document.querySelector('#selected-school-summary').textContent=school==='todos'?'Todos los colegios y jardín infantil':choice.querySelector('strong').textContent;
    document.querySelector('#uniformes-title').textContent=school==='todos'?'Todos los uniformes':choice.querySelector('strong').textContent;
  }
  const category=document.querySelector('[data-filter][aria-pressed="true"]').dataset.filter;
  products.forEach(product=>product.hidden=!matchesSelectedSchool(product)||(category!=='todos'&&product.dataset.category!==category));
  setMobileScreen('colegios',false);
}
document.querySelectorAll('[data-select-school]').forEach(button=>button.addEventListener('click',()=>{
  history.pushState({},'', 'colegios.htm?colegio='+button.dataset.selectSchool);
  filters[0].click(); showSchoolSelection(); window.scrollTo({top:0,behavior:'instant'});
}));
document.querySelector('[data-change-school]').addEventListener('click',()=>{
  history.pushState({},'','colegios.htm');showSchoolSelection();window.scrollTo({top:0,behavior:'instant'});
});
window.addEventListener('popstate',showSchoolSelection);
mobileLayout.addEventListener('change',showSchoolSelection);
showSchoolSelection();
