import getDados from "./getDados.js";

const params          = new URLSearchParams(window.location.search);
const serieId         = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie      = document.getElementById('temporadas-episodios');
const fichaDescricao  = document.getElementById('ficha-descricao');

function carregarInfoSerie() {
    getDados('/series/' + serieId)
        .then(data => {
            if (!data) { fichaDescricao.innerHTML = '<p>Serie nao encontrada.</p>'; return; }
            document.title = data.titulo + ' - MarkFilmes';
            fichaDescricao.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" class="ficha-poster">
                <div class="ficha-info">
                    <h2>${data.titulo}</h2>
                    <p class="ficha-genero">${data.genero || ''} - ${data.totalTemporadas || 0} temporada(s)</p>
                    <p class="ficha-avaliacao">&#11088; ${data.avaliacao || '-'}/10</p>
                    <p class="ficha-sinopse">${data.sinopse || ''}</p>
                    <p class="ficha-elenco"><strong>Elenco:</strong> ${data.atores || ''}</p>
                    <a href="index.html" class="btn-voltar">&#8592; Voltar</a>
                </div>
            `;
        })
        .catch(err => console.error('Erro ao obter informacoes da serie:', err));
}

function carregarTemporadas() {
    getDados('/series/' + serieId + '/temporadas/todas')
        .then(data => {
            if (!data || data.length === 0) {
                listaTemporadas.innerHTML = '<option>Sem temporadas</option>';
                return;
            }
            const temporadasUnicas = [...new Set(data.map(ep => ep.temporada))].sort((a,b) => a-b);
            listaTemporadas.innerHTML = '';

            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.textContent = 'Selecione a temporada';
            listaTemporadas.appendChild(optDefault);

            temporadasUnicas.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = 'Temporada ' + t;
                listaTemporadas.appendChild(opt);
            });

            const optTodas = document.createElement('option');
            optTodas.value = 'todas';
            optTodas.textContent = 'Todas as temporadas';
            listaTemporadas.appendChild(optTodas);
        })
        .catch(err => console.error('Erro ao obter temporadas:', err));
}

function carregarEpisodios() {
    const valor = listaTemporadas.value;
    if (!valor) return;

    getDados('/series/' + serieId + '/temporadas/' + valor)
        .then(data => {
            fichaSerie.innerHTML = '';
            if (!data || data.length === 0) {
                fichaSerie.innerHTML = '<p>Nenhum episodio encontrado.</p>';
                return;
            }
            const temporadasUnicas = [...new Set(data.map(ep => ep.temporada))].sort((a,b) => a-b);
            temporadasUnicas.forEach(temporada => {
                const eps = data.filter(ep => ep.temporada === temporada);
                const titulo = document.createElement('p');
                titulo.className = 'temporada-titulo';
                titulo.textContent = 'Temporada ' + temporada;
                fichaSerie.appendChild(titulo);

                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';
                ul.innerHTML = eps.map(ep => `
                    <li>
                        <span class="ep-numero">Ep. ${ep.numeroEpisodio}</span>
                        <span class="ep-titulo">${ep.titulo}</span>
                    </li>
                `).join('');
                fichaSerie.appendChild(ul);
            });
        })
        .catch(err => console.error('Erro ao obter episodios:', err));
}

listaTemporadas.addEventListener('change', carregarEpisodios);

if (serieId) {
    carregarInfoSerie();
    carregarTemporadas();
} else {
    fichaDescricao.innerHTML = '<p>ID da serie nao informado.</p>';
}
