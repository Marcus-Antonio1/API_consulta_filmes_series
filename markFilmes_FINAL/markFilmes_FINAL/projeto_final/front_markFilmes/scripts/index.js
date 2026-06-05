import getDados from './getDados.js';
import { inicializarBusca, inicializarHeroBusca } from './busca.js';

const el = {
  lancamentos: document.querySelector('[data-name="lancamentos"]'),
  top5:        document.querySelector('[data-name="top5"]'),
  series:      document.querySelector('[data-name="series"]'),
  filmes:      document.querySelector('[data-name="filmes"]'),
  categoria:   document.querySelector('[data-name="categoria"]'),
  separador:   document.querySelector('[data-separador]'),
};

function _card(item, href) {
  return `<li><a href="${href}">
    <img src="${item.poster}" alt="${item.titulo}" loading="lazy">
    <span class="card-titulo">${item.titulo}</span>
  </a></li>`;
}

function renderSeries(secao, dados) {
  if (!secao) return;
  if (!dados || dados.length === 0) { secao.style.display = 'none'; return; }
  secao.style.display = '';
  const h2 = document.createElement('h2');
  h2.textContent = secao.dataset.titulo;
  const ul = document.createElement('ul');
  ul.className = 'lista';
  ul.innerHTML = dados.map(i => _card(i, `detalhes.html?id=${i.id}`)).join('');
  secao.innerHTML = '';
  secao.appendChild(h2);
  secao.appendChild(ul);
}

function renderFilmes(secao, dados) {
  if (!secao) return;
  if (!dados || dados.length === 0) { secao.style.display = 'none'; return; }
  secao.style.display = '';
  const h2 = document.createElement('h2');
  h2.textContent = secao.dataset.titulo;
  const ul = document.createElement('ul');
  ul.className = 'lista';
  ul.innerHTML = dados.map(i => _card(i, `detalhes-filmes.html?id=${i.id}`)).join('');
  secao.innerHTML = '';
  secao.appendChild(h2);
  secao.appendChild(ul);
}

function carregarSeries() {
  Promise.all([getDados('/series/top5'), getDados('/series/lancamentos'), getDados('/series')])
    .then(([top5, lanc, series]) => {
      renderSeries(el.lancamentos, lanc);
      renderSeries(el.top5, top5);
      const usados = [...top5.map(s=>s.id), ...lanc.map(s=>s.id)];
      renderSeries(el.series, series.filter(s => !usados.includes(s.id)).slice(0, 8));
    })
    .catch(console.error);
}

function carregarFilmes() {
  getDados('/filmes')
    .then(d => renderFilmes(el.filmes, d.slice(0, 8)))
    .catch(console.error);
}

const catSelect = document.querySelector('[data-categorias]');
const normais   = document.querySelectorAll('.section, [data-separador]');

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
      'Categoria: ' + cat.charAt(0).toUpperCase() + cat.slice(1);

    Promise.all([
      getDados('/series/categoria/' + encodeURIComponent(cat)),
      getDados('/filmes/categoria/' + encodeURIComponent(cat)),
    ]).then(([series, filmes]) => {
      const todos = [...series, ...filmes];
      const ulEx = el.categoria.querySelector('ul');
      if (ulEx) ulEx.remove();
      if (!todos.length) return;
      const ul = document.createElement('ul');
      ul.className = 'lista';
      ul.innerHTML = todos.map(i => {
        const href = i.totalTemporadas !== undefined
          ? 'detalhes.html?id=' + i.id
          : 'detalhes-filmes.html?id=' + i.id;
        return _card(i, href);
      }).join('');
      el.categoria.appendChild(ul);
    }).catch(console.error);
  });
}

carregarSeries();
carregarFilmes();
inicializarBusca();
inicializarHeroBusca();
