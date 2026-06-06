import { toggleFavorito, isFavorito } from './favoritos.js';
import { abrirModal } from './modal.js';

export function criarCard(item, tipo) {
  const fav = isFavorito(item.id, tipo);
  const href = tipo === 'serie' ? `detalhes.html?id=${item.id}` : `detalhes-filmes.html?id=${item.id}`;
  const div = document.createElement('div');
  div.className = 'carousel-card';
  div.innerHTML = `
    <img src="${item.poster}" alt="${item.titulo}" loading="lazy">
    <div class="card-titulo-fixo">${item.titulo}</div>
    <div class="card-overlay">
      <span class="card-overlay-titulo">${item.titulo}</span>
      <span class="card-overlay-meta">${item.genero || ''} ${item.avaliacao ? '· ⭐ ' + item.avaliacao : ''}</span>
      <div class="card-overlay-actions">
        <button class="card-btn card-btn-ver" data-href="${href}">▶ Ver</button>
        <button class="card-btn card-btn-fav ${fav ? 'favoritado' : ''}"
          data-id="${item.id}" data-tipo="${tipo}">${fav ? '❤' : '♡'}</button>
      </div>
    </div>
  `;
  // clique no poster → abre modal
  div.querySelector('img').addEventListener('click', () => abrirModal(item, tipo));
  div.querySelector('.card-overlay-titulo').addEventListener('click', () => abrirModal(item, tipo));
  // botão Ver → navega
  div.querySelector('.card-btn-ver').addEventListener('click', e => {
    e.stopPropagation();
    window.location.href = href;
  });
  // botão Fav
  div.querySelector('.card-btn-fav').addEventListener('click', e => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const adicionado = toggleFavorito({ ...item, tipo });
    btn.classList.toggle('favoritado', adicionado);
    btn.textContent = adicionado ? '❤' : '♡';
  });
  return div;
}

export function preencherCarrossel(trackId, dados, tipo, infinito = false) {
  const track = document.getElementById(trackId);
  if (!track || !dados || !dados.length) return;
  track.innerHTML = '';
  const cards = dados.map(item => criarCard(item, tipo));
  cards.forEach(c => track.appendChild(c));
  // duplica para carrossel infinito
  if (infinito) {
    cards.forEach(c => track.appendChild(c.cloneNode(true)));
    // re-bind nos clones
    track.querySelectorAll('.card-btn-fav').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id   = Number(btn.dataset.id);
        const tipo = btn.dataset.tipo;
        const item = dados.find(d => d.id === id) || { id, tipo };
        const ok = toggleFavorito({ ...item, tipo });
        document.querySelectorAll(`.card-btn-fav[data-id="${id}"][data-tipo="${tipo}"]`).forEach(b => {
          b.classList.toggle('favoritado', ok);
          b.textContent = ok ? '❤' : '♡';
        });
      });
    });
    track.querySelectorAll('.card-btn-ver').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        window.location.href = btn.dataset.href;
      });
    });
  }
}

// scroll manual (setas)
window.scrollCarousel = function(trackId, dir) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const cardW = track.querySelector('.carousel-card')?.offsetWidth || 200;
  const gap = 20;
  const step = (cardW + gap) * 3;
  const wrapper = track.parentElement;
  wrapper._offset = (wrapper._offset || 0) + dir * step;
  const maxScroll = track.scrollWidth / 2;
  if (wrapper._offset < 0) wrapper._offset = 0;
  if (wrapper._offset > maxScroll) wrapper._offset = maxScroll;
  track.style.transform = `translateX(-${wrapper._offset}px)`;
};
