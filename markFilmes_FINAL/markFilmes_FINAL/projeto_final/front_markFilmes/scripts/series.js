import getDados from './getDados.js';

const params   = new URLSearchParams(window.location.search);
const serieId  = params.get('id');
const selTemp  = document.getElementById('temporadas-select');
const divEps   = document.getElementById('temporadas-episodios');
const divInfo  = document.getElementById('ficha-descricao');
const bread    = document.getElementById('breadcrumb-titulo');

function estrelas(nota) {
  const n = Math.round(nota / 2);
  return '<span style="color:#f5c518">' + '★'.repeat(n) + '</span>' +
    '<span style="color:rgba(255,255,255,0.2)">' + '★'.repeat(5 - n) + '</span>';
}

function carregarInfo() {
  getDados('/series/' + serieId).then(d => {
    if (!d) { divInfo.innerHTML = '<p>Serie nao encontrada.</p>'; return; }
    document.title = d.titulo + ' - MarkFilmes';
    if (bread) bread.textContent = d.titulo;
    divInfo.innerHTML = `
      <img src="${d.poster}" alt="${d.titulo}" class="ficha-poster">
      <div class="ficha-info">
        <span class="ficha-badge">Serie</span>
        <h2>${d.titulo}</h2>
        <div class="ficha-meta">
          <div class="ficha-meta-item">
            <span style="color:var(--accent)">&#9673;</span>
            ${d.totalTemporadas || 0} temporada(s)
          </div>
          <div class="ficha-meta-item">${d.genero || ''}</div>
        </div>
        <div class="ficha-avaliacao">
          ${estrelas(d.avaliacao || 0)} &nbsp;${d.avaliacao || '-'}<span>/10</span>
        </div>
        <p class="ficha-sinopse">${d.sinopse || ''}</p>
        <p class="ficha-elenco"><strong>Elenco:</strong> ${d.atores || ''}</p>
        <a href="index.html" class="btn-voltar">&#8592; Voltar</a>
      </div>`;
  }).catch(console.error);
}

function carregarTemporadas() {
  getDados('/series/' + serieId + '/temporadas/todas').then(eps => {
    if (!eps || !eps.length) { selTemp.innerHTML = '<option>Sem temporadas</option>'; return; }
    const unicas = [...new Set(eps.map(e => e.temporada))].sort((a,b) => a-b);
    selTemp.innerHTML = '<option value="">Selecione a temporada</option>';
    unicas.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = 'Temporada ' + t;
      selTemp.appendChild(opt);
    });
    const all = document.createElement('option');
    all.value = 'todas'; all.textContent = 'Todas';
    selTemp.appendChild(all);
  }).catch(console.error);
}

function carregarEpisodios() {
  const val = selTemp.value;
  if (!val) return;
  getDados('/series/' + serieId + '/temporadas/' + val).then(eps => {
    divEps.innerHTML = '';
    if (!eps || !eps.length) { divEps.innerHTML = '<p>Nenhum episodio encontrado.</p>'; return; }
    const unicas = [...new Set(eps.map(e => e.temporada))].sort((a,b) => a-b);
    unicas.forEach(t => {
      const titulo = document.createElement('p');
      titulo.className = 'temporada-titulo';
      titulo.textContent = 'Temporada ' + t;
      divEps.appendChild(titulo);
      const ul = document.createElement('ul');
      ul.className = 'episodios-lista';
      ul.innerHTML = eps.filter(e => e.temporada === t).map(e =>
        `<li><span class="ep-numero">Ep. ${e.numeroEpisodio}</span>
             <span class="ep-titulo">${e.titulo}</span></li>`
      ).join('');
      divEps.appendChild(ul);
    });
  }).catch(console.error);
}

selTemp.addEventListener('change', carregarEpisodios);
if (serieId) { carregarInfo(); carregarTemporadas(); }
else divInfo.innerHTML = '<p>ID nao informado.</p>';
