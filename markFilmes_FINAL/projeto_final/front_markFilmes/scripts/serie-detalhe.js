import getDados from './getDados.js';

async function carregarSeries() {
  const series = await getDados('/series');

  const container = document.getElementById('series-carousel');

  if (!container) return;

  container.innerHTML = series.map(item => `
    <div class="carousel-item">
      <a href="detalhes.html?id=${item.id}">
        <img src="${item.poster}">
        <div class="card-title">${item.titulo}</div>
      </a>
    </div>
  `).join('');
}

carregarSeries();