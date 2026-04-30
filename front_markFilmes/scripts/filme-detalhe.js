import getDados from "./getDados.js";

const params          = new URLSearchParams(window.location.search);
const filmeId         = params.get('id');
const fichaDescricao  = document.getElementById('ficha-descricao');

function carregarInfoFilme() {
    if (!filmeId || !fichaDescricao) return;

    getDados('/filmes/' + filmeId)
        .then(f => {
            const filme = Array.isArray(f)
                ? f.find(x => String(x.id) === String(filmeId)) || f[0]
                : f;

            if (!filme) { fichaDescricao.innerHTML = '<p>Filme nao encontrado.</p>'; return; }

            document.title = filme.titulo + ' - MarkFilmes';
            fichaDescricao.innerHTML = `
                <img src="${filme.poster}" alt="${filme.titulo}" class="ficha-poster">
                <div class="ficha-info">
                    <h2>${filme.titulo}</h2>
                    <p class="ficha-genero">${filme.genero || ''} - ${filme.anoLancamento || ''} - ${filme.duracao || ''}</p>
                    <p class="ficha-avaliacao">&#11088; ${filme.avaliacao || '-'}/10</p>
                    <p class="ficha-sinopse">${filme.sinopse || ''}</p>
                    <p class="ficha-elenco"><strong>Elenco:</strong> ${filme.atores || ''}</p>
                    <a href="filmes.html" class="btn-voltar">&#8592; Voltar para Filmes</a>
                </div>
            `;
        })
        .catch(() => { fichaDescricao.innerHTML = '<p>Erro ao carregar o filme.</p>'; });
}

carregarInfoFilme();
