import { getFavoritos, toggleFavorito, atualizarBadge } from './favoritos.js';
import { abrirModal } from './modal.js';
import { criarCard } from './carousel.js';

function renderFavoritos() {
  const container = document.getElementById('fav-container');
  if (!container) return;
  const favs = getFavoritos();
  if (!favs.length) {
    container.innerHTML = `
      <div class="favoritos-vazio">
        <div class="icon">🎬</div>
        <h3>Nenhum favorito ainda</h3>
        <p>Explore filmes e séries e clique em ♡ para salvar aqui.</p>
      </div>`;
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'fav-grid';
  favs.forEach(item => {
    const card = criarCard(item, item.tipo);
    grid.appendChild(card);
  });
  container.innerHTML = '';
  container.appendChild(grid);
}

renderFavoritos();
