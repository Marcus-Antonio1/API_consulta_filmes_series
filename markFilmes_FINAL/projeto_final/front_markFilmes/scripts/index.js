import getDados from './getDados.js';
import { inicializarBusca, inicializarHeroBusca } from './busca.js';
import { preencherCarrossel } from './carousel.js';
import { abrirModal } from './modal.js';

async function carregarHome() {
  try {
    const [series, filmes, lanc] = await Promise.all([
      getDados('/series'),
      getDados('/filmes'),
      getDados('/series/lancamentos'),
    ]);
    preencherCarrossel('carousel-lancamentos', lanc, 'serie', false);
    preencherCarrossel('carousel-series', series, 'serie', true);
    preencherCarrossel('carousel-filmes', filmes, 'filme', true);
  } catch (e) { console.error('Erro ao carregar home:', e); }
}

// filtro de categoria
const catSelect = document.querySelector('[data-categorias]');
const sections  = document.querySelectorAll('.section');
const catSection = document.querySelector('[data-name="categoria"]');

if (catSelect) {
  catSelect.addEventListener('change', async () => {
    const cat = catSelect.value;
    if (cat === 'todos') {
      sections.forEach(s => s.classList.remove('hidden'));
      catSection && catSection.classList.add('hidden');
      return;
    }
    sections.forEach(s => s.classList.add('hidden'));
    catSection && catSection.classList.remove('hidden');
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    const titulo = document.getElementById('cat-titulo');
    if (titulo) titulo.textContent = '🎯 ' + label;
    const [series, filmes] = await Promise.all([
      getDados('/series/categoria/' + encodeURIComponent(cat)),
      getDados('/filmes/categoria/' + encodeURIComponent(cat)),
    ]);
    const todos = [
      ...series.map(s => ({...s, _tipo: 'serie'})),
      ...filmes.map(f => ({...f, _tipo: 'filme'})),
    ];
    const track = document.getElementById('carousel-categoria');
    if (track) {
      track.innerHTML = '';
      track.className = 'carousel-track';
    }
    const { criarCard } = await import('./carousel.js');
    todos.forEach(item => {
      const card = criarCard(item, item._tipo);
      track && track.appendChild(card);
    });
  });
}

carregarHome();
inicializarBusca();
inicializarHeroBusca();
