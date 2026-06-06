import getDados from './getDados.js';
import { inicializarBusca, inicializarHeroBusca } from './busca.js';

const el = {
  lancamentos: document.querySelector('[data-name="lancamentos"]'),
  series: document.querySelector('[data-name="series"]'),
  filmes: document.querySelector('[data-name="filmes"]'),
  categoria: document.querySelector('[data-name="categoria"]')
};

function criarCard(item, href) {
  return `
    <li>
      <a href="${href}">
        <img
          src="${item.poster}"
          alt="${item.titulo}"
          loading="lazy">

        <span class="card-titulo">
          ${item.titulo}
        </span>
      </a>
    </li>
  `;
}

function renderSecao(secao, dados, tipo) {

  if (!secao) return;

  const ulAntiga = secao.querySelector('ul');

  if (ulAntiga) {
    ulAntiga.remove();
  }

  if (!dados || !dados.length) {
    secao.style.display = 'none';
    return;
  }

  secao.style.display = '';

  const ul = document.createElement('ul');

  ul.className = 'lista';

  ul.innerHTML = dados.map(item => {

    const href =
      tipo === 'serie'
        ? `detalhes.html?id=${item.id}`
        : `detalhes-filmes.html?id=${item.id}`;

    return criarCard(item, href);

  }).join('');

  secao.appendChild(ul);
}

async function carregarHome() {

  try {

    const [
      series,
      filmes,
      lancamentos
    ] = await Promise.all([

      getDados('/series'),

      getDados('/filmes'),

      getDados('/series/lancamentos')

    ]);

    renderSecao(
      el.lancamentos,
      lancamentos.slice(0, 8),
      'serie'
    );

    renderSecao(
      el.series,
      series.slice(0, 8),
      'serie'
    );

    renderSecao(
      el.filmes,
      filmes.slice(0, 8),
      'filme'
    );

  } catch (erro) {

    console.error(
      'Erro ao carregar Home:',
      erro
    );

  }
}

const catSelect =
  document.querySelector(
    '[data-categorias]'
  );

if (catSelect) {

  catSelect.addEventListener(
    'change',
    async () => {

      const categoria =
        catSelect.value;

      if (categoria === 'todos') {

        document
          .querySelectorAll('.section')
          .forEach(secao =>
            secao.classList.remove('hidden')
          );

        el.categoria.classList.add('hidden');

        return;
      }

      try {

        const [
          series,
          filmes
        ] = await Promise.all([

          getDados(
            '/series/categoria/' +
            encodeURIComponent(categoria)
          ),

          getDados(
            '/filmes/categoria/' +
            encodeURIComponent(categoria)
          )

        ]);

        document
          .querySelectorAll('.section')
          .forEach(secao =>
            secao.classList.add('hidden')
          );

        el.categoria.classList.remove('hidden');

        el.categoria.innerHTML = `
          <h2>
            Categoria:
            ${categoria}
          </h2>
        `;

        const lista =
          document.createElement('ul');

        lista.className = 'lista';

        const todos = [
          ...series,
          ...filmes
        ];

        lista.innerHTML = todos.map(item => {

          const isSerie =
            item.totalTemporadas !== undefined;

          return criarCard(
            item,
            isSerie
              ? `detalhes.html?id=${item.id}`
              : `detalhes-filmes.html?id=${item.id}`
          );

        }).join('');

        el.categoria.appendChild(lista);

      } catch (erro) {

        console.error(erro);

      }
    }
  );
}

carregarHome();

inicializarBusca();
inicializarHeroBusca();