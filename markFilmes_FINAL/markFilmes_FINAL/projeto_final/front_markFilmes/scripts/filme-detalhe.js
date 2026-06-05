import getDados from './getDados.js';

const params  = new URLSearchParams(window.location.search);
const filmeId = params.get('id');
const divInfo = document.getElementById('ficha-descricao');
const bread   = document.getElementById('breadcrumb-titulo');

function estrelas(nota) {
  const n = Math.round(nota / 2);
  return '<span style="color:#f5c518">' + '★'.repeat(n) + '</span>' +
    '<span style="color:rgba(255,255,255,0.2)">' + '★'.repeat(5 - n) + '</span>';
}

function carregar() {
  if (!filmeId || !divInfo) return;
  getDados('/filmes/' + filmeId).then(f => {
    const filme = Array.isArray(f)
      ? f.find(x => String(x.id) === String(filmeId)) || f[0]
      : f;
    if (!filme) { divInfo.innerHTML = '<p>Filme nao encontrado.</p>'; return; }
    document.title = filme.titulo + ' - MarkFilmes';
    if (bread) bread.textContent = filme.titulo;
    divInfo.innerHTML = `
      <img src="${filme.poster}" alt="${filme.titulo}" class="ficha-poster">
      <div class="ficha-info">
        <span class="ficha-badge">Filme</span>
        <h2>${filme.titulo}</h2>
        <div class="ficha-meta">
          <div class="ficha-meta-item">${filme.anoLancamento || ''}</div>
          <div class="ficha-meta-item">${filme.duracao || ''}</div>
          <div class="ficha-meta-item">${filme.genero || ''}</div>
        </div>
        <div class="ficha-avaliacao">
          ${estrelas(filme.avaliacao || 0)} &nbsp;${filme.avaliacao || '-'}<span>/10</span>
        </div>
        <p class="ficha-sinopse">${filme.sinopse || ''}</p>
        <p class="ficha-elenco"><strong>Elenco:</strong> ${filme.atores || ''}</p>
        <a href="filmes.html" class="btn-voltar">&#8592; Voltar</a>
      </div>`;
  }).catch(() => { divInfo.innerHTML = '<p>Erro ao carregar filme.</p>'; });
}

carregar();
