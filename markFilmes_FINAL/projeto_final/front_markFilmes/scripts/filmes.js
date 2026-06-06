import getDados from './getDados.js';

function renderCarousel(containerId, dados, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = dados.map(item => {

    const href =
      tipo === 'filme'
        ? `detalhes-filmes.html?id=${item.id}`
        : `detalhes.html?id=${item.id}`;

    return `
      <div class="carousel-item">
        <a href="${href}">
          <img src="${item.poster}" alt="${item.titulo}">
          <div class="card-title">${item.titulo}</div>
        </a>
      </div>
    `;
  }).join('');
}

async function carregarFilmes() {
  const filmes = await getDados('/filmes');

  renderCarousel('filmes-carousel', filmes, 'filme');
}

carregarFilmes();