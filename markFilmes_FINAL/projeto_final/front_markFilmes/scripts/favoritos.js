// Gerencia favoritos no localStorage

const KEY = 'markfilmes_favoritos';

export function getFavoritos() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

export function toggleFavorito(item) {
  const favs = getFavoritos();
  const idx = favs.findIndex(f => f.id === item.id && f.tipo === item.tipo);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(item);
  localStorage.setItem(KEY, JSON.stringify(favs));
  atualizarBadge();
  return idx < 0; // true = foi adicionado
}

export function isFavorito(id, tipo) {
  return getFavoritos().some(f => f.id === id && f.tipo === tipo);
}

export function atualizarBadge() {
  const n = getFavoritos().length;
  document.querySelectorAll('#fav-count').forEach(el => {
    el.textContent = n;
    el.classList.toggle('visible', n > 0);
  });
}

// Inicializa badge ao carregar
atualizarBadge();
