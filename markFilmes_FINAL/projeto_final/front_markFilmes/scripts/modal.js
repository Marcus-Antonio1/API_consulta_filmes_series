import { toggleFavorito, isFavorito, atualizarBadge } from './favoritos.js';
import getDados from './getDados.js';

const BASE = 'http://localhost:8080';
const overlay   = document.getElementById('modal');
const backdrop  = document.getElementById('modal-backdrop');
const inner     = document.getElementById('modal-inner');
const tempDiv   = document.getElementById('modal-temporadas');
const closeBtn  = document.getElementById('modal-close');

function estrelas(nota) {
  const n = Math.round((nota || 0) / 2);
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export function abrirModal(item, tipo) {
  // fundo desfocado com o poster
  backdrop.style.backgroundImage = `url('${item.poster}')`;
  
  const fav = isFavorito(item.id, tipo);
  const href = tipo === 'serie'
    ? `detalhes.html?id=${item.id}`
    : `detalhes-filmes.html?id=${item.id}`;

  inner.innerHTML = `
    <img src="${item.poster}" class="modal-poster" alt="${item.titulo}">
    <div class="modal-info">
      <span class="modal-badge">${tipo === 'serie' ? '📺 Série' : '🎬 Filme'}</span>
      <h2 class="modal-titulo">${item.titulo}</h2>
      <div class="modal-meta">
        ${item.genero ? `<span class="modal-meta-item">🎭 ${item.genero}</span>` : ''}
        ${item.totalTemporadas ? `<span class="modal-meta-item">📅 ${item.totalTemporadas} temporada(s)</span>` : ''}
        ${item.anoLancamento ? `<span class="modal-meta-item">📅 ${item.anoLancamento}</span>` : ''}
        ${item.duracao ? `<span class="modal-meta-item">⏱ ${item.duracao}</span>` : ''}
      </div>
      ${item.avaliacao ? `<div class="modal-avaliacao">${estrelas(item.avaliacao)} <strong>${item.avaliacao}</strong>/10</div>` : ''}
      ${item.sinopse ? `<p class="modal-sinopse">${item.sinopse}</p>` : ''}
      ${item.atores ? `<p class="modal-elenco"><strong>Elenco:</strong> ${item.atores}</p>` : ''}
      <div class="modal-actions">
        <a href="${href}" class="modal-btn-primary">▶ Ver detalhes</a>
        <button class="modal-btn-fav ${fav ? 'favoritado' : ''}" id="modal-fav-btn">
          ${fav ? '❤ Favoritado' : '♡ Favoritar'}
        </button>
      </div>
    </div>
  `;

  // temporadas para série
  if (tipo === 'serie') {
    tempDiv.classList.remove('hidden');
    tempDiv.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem">Carregando episódios...</p>';
    getDados(`/series/${item.id}/temporadas/todas`)
      .then(eps => {
        if (!eps || !eps.length) { tempDiv.innerHTML = ''; return; }
        const unicas = [...new Set(eps.map(e => e.temporada))].sort((a,b)=>a-b);
        const opts = unicas.map(t => `<option value="${t}">Temporada ${t}</option>`).join('');
        tempDiv.innerHTML = `
          <h3>Episódios</h3>
          <select class="modal-temp-select" id="modal-sel-temp">
            <option value="">Selecione a temporada</option>${opts}
            <option value="todas">Todas</option>
          </select>
          <ul class="modal-eps-lista" id="modal-eps-lista"></ul>
        `;
        document.getElementById('modal-sel-temp').addEventListener('change', function() {
          const val = this.value;
          if (!val) return;
          const filtrados = val === 'todas' ? eps : eps.filter(e => e.temporada == val);
          document.getElementById('modal-eps-lista').innerHTML = filtrados.map(e =>
            `<li><span class="ep-num">Ep. ${e.numeroEpisodio}</span>${e.titulo}</li>`
          ).join('');
        });
      })
      .catch(() => { tempDiv.innerHTML = ''; });
  } else {
    tempDiv.classList.add('hidden');
    tempDiv.innerHTML = '';
  }

  // botão favoritar no modal
  document.getElementById('modal-fav-btn').addEventListener('click', function() {
    const adicionado = toggleFavorito({ ...item, tipo });
    this.classList.toggle('favoritado', adicionado);
    this.textContent = adicionado ? '❤ Favoritado' : '♡ Favoritar';
    // atualiza os cards na página
    document.querySelectorAll(`.card-btn-fav[data-id="${item.id}"][data-tipo="${tipo}"]`).forEach(btn => {
      btn.classList.toggle('favoritado', adicionado);
      btn.textContent = adicionado ? '❤' : '♡';
    });
  });

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    inner.innerHTML = '';
    tempDiv.innerHTML = '';
    tempDiv.classList.add('hidden');
  }, 400);
}

closeBtn.addEventListener('click', fecharModal);
overlay.addEventListener('click', e => { if (e.target === overlay || e.target === backdrop) fecharModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });
