import getDados from './getDados.js';
import { preencherCarrossel } from './carousel.js';

async function carregar() {
  try {
    const series = await getDados('/series');
    preencherCarrossel('carousel-series', series, 'serie', true);
  } catch(e) { console.error(e); }
}

const catSelect = document.querySelector('[data-categorias]');
if (catSelect) {
  catSelect.addEventListener('change', async () => {
    const cat = catSelect.value;
    const catSection = document.querySelector('[data-name="categoria"]');
    if (cat === 'todos') {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('hidden'));
      catSection && catSection.classList.add('hidden');
      return;
    }
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    catSection && catSection.classList.remove('hidden');
    const titulo = document.getElementById('cat-titulo');
    if (titulo) titulo.textContent = '📺 ' + cat.charAt(0).toUpperCase() + cat.slice(1);
    const series = await getDados('/series/categoria/' + encodeURIComponent(cat));
    const track = document.getElementById('carousel-categoria');
    if (track) { track.innerHTML = ''; track.className = 'carousel-track'; }
    const { criarCard } = await import('./carousel.js');
    series.forEach(s => track && track.appendChild(criarCard(s, 'serie')));
  });
}
carregar();
