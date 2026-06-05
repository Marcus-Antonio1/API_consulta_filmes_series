import getDados from './getDados.js';
import { inicializarBusca } from './busca.js';

const el = {
  lancamentos: document.querySelector('[data-name="lancamentos"]'),
  top5:        document.querySelector('[data-name="top5"]'),
  filmes:      document.querySelector('[data-name="filmes"]'),
  categoria:   document.querySelector('[data-name="categoria"]'),
};

function render(secao, dados) {
  if (!secao) return;
  const ulEx = secao.querySelector('ul');
  if (ulEx) ulEx.remove();
  if (!dados || !dados.length) { secao.style.display = 'none'; return; }
  secao.style.display = '';
  const ul = document.createElement('ul');
  ul.className = 'lista';
  ul.innerHTML = dados.map(f =>
    `<li><a href="detalhes-filmes.html?id=${f.id}">
      <img src="${f.poster}" alt="${f.titulo}" loading="lazy">
      <span class="card-titulo">${f.titulo}</span>
    </a></li>`
  ).join('');
  secao.appendChild(ul);
}

function geraFilmes() {
  Promise.all([getDados('/filmes/top5'), getDados('/filmes/lancamentos'), getDados('/filmes')])
    .then(([top5, lanc, filmes]) => {
      render(el.lancamentos, lanc);
      render(el.top5, top5);
      const usados = [...top5.map(f=>f.id), ...lanc.map(f=>f.id)];
      render(el.filmes, filmes.filter(f => !usados.includes(f.id)));
    })
    .catch(console.error);
}

const catSelect = document.querySelector('[data-categorias]');
const normais   = document.querySelectorAll('.section');

if (catSelect) {
  catSelect.addEventListener('change', () => {
    const cat = catSelect.value;
    if (cat === 'todos') {
      normais.forEach(s => s.classList.remove('hidden'));
      el.categoria.classList.add('hidden');
      return;
    }
    normais.forEach(s => s.classList.add('hidden'));
    el.categoria.classList.remove('hidden');
    el.categoria.querySelector('h2').textContent =
      'Filmes: ' + cat.charAt(0).toUpperCase() + cat.slice(1);
    getDados('/filmes/categoria/' + encodeURIComponent(cat))
      .then(d => render(el.categoria, d))
      .catch(console.error);
  });
}

geraFilmes();
inicializarBusca();
