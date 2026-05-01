import getDados from "./getDados.js";
import { inicializarBusca } from "./busca.js";

const elementos = {
    top5:      document.querySelector('[data-name="top5"]'),
    lancamentos:document.querySelector('[data-name="lancamentos"]'),
    filmes:    document.querySelector('[data-name="filmes"]'),
    categoria: document.querySelector('[data-name="categoria"]'),
};

function criarListaFilmes(elemento, dados) {
    if (!elemento || !dados || dados.length === 0) return;
    const ulExistente = elemento.querySelector('ul');
    if (ulExistente) ulExistente.remove();
    const ul = document.createElement('ul');
    ul.className = 'lista';
    ul.innerHTML = dados.map(filme => `
        <li>
            <a href="detalhes-filmes.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}" loading="lazy">
                <span class="card-titulo">${filme.titulo}</span>
            </a>
        </li>
    `).join('');
    elemento.appendChild(ul);
}

function geraFilmes() {
    Promise.all([
        getDados('/filmes/top5'),
        getDados('/filmes/lancamentos'),
        getDados('/filmes'),
    ]).then(([top5, lancamentos, filmes]) => {
        criarListaFilmes(elementos.top5, top5);
        criarListaFilmes(elementos.lancamentos, lancamentos);
        const idsUsados = [...top5.map(f => f.id), ...lancamentos.map(f => f.id)];
        criarListaFilmes(elementos.filmes, filmes.filter(f => !idsUsados.includes(f.id)));
    }).catch(err => console.error("Erro ao carregar filmes:", err));
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsNormais = document.querySelectorAll('.section');

if (categoriaSelect) {
    categoriaSelect.addEventListener('change', function () {
        const cat = categoriaSelect.value;
        if (cat === 'todos') {
            sectionsNormais.forEach(s => s.classList.remove('hidden'));
            elementos.categoria.classList.add('hidden');
            geraFilmes();
            return;
        }
        sectionsNormais.forEach(s => s.classList.add('hidden'));
        elementos.categoria.classList.remove('hidden');
        elementos.categoria.querySelector('h2').textContent =
            'Filmes: ' + cat.charAt(0).toUpperCase() + cat.slice(1);
        getDados('/filmes/categoria/' + encodeURIComponent(cat))
            .then(data => criarListaFilmes(elementos.categoria, data))
            .catch(err => console.error('Erro ao carregar categoria:', err));
    });
}

geraFilmes();
inicializarBusca();
