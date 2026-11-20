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
document.querySelectorAll('[data-product]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#service').value = link.dataset.product;
}));
const form = document.querySelector('#quote-form');
const nameField = document.querySelector('#name');
const help = document.querySelector('#name-help');
function validateName() {
  const valid = nameField.value.trim().length > 0;
  nameField.setAttribute('aria-invalid', String(!valid));
  help.textContent = valid ? '' : 'Escribe tu nombre para preparar la consulta.';
  return valid;
}
nameField.addEventListener('blur', validateName);
nameField.addEventListener('input', () => {
  if (nameField.getAttribute('aria-invalid') === 'true') validateName();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateName()) { nameField.focus(); return; }
  const service = document.querySelector('#service').value;
  const details = document.querySelector('#message').value.trim();
  const message = `Hola Nathy, soy ${nameField.value.trim()}. Quisiera consultar por: ${service}.${details ? `\n\n${details}` : ''}`;
  const url = `https://wa.me/56994767883?text=${encodeURIComponent(message)}`;
  const fallback = document.querySelector('#whatsapp-fallback');
  fallback.href = url;
  fallback.classList.remove('hidden');
  document.querySelector('#form-status').textContent = 'Tu consulta está preparada. Si WhatsApp no se abre, usa el enlace de abajo.';
  window.open(url, '_blank', 'noopener,noreferrer');
});
document.querySelector('#year').textContent = new Date().getFullYear();
