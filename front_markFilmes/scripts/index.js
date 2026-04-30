import getDados from "./getDados.js";
import { inicializarBusca } from "./busca.js";

const elementos = {
    top5:      document.querySelector('[data-name="top5"]'),
    lancamentos:document.querySelector('[data-name="lancamentos"]'),
    series:    document.querySelector('[data-name="series"]'),
    filmes:    document.querySelector('[data-name="filmes"]'),
    categoria: document.querySelector('[data-name="categoria"]'),
};

function criarListaSeries(elemento, dados) {
    if (!elemento || !dados || dados.length === 0) return;
    const ul = document.createElement('ul');
    ul.className = 'lista';
    ul.innerHTML = dados.map(item => `
        <li>
            <a href="detalhes.html?id=${item.id}">
                <img src="${item.poster}" alt="${item.titulo}" loading="lazy">
                <span class="card-titulo">${item.titulo}</span>
            </a>
        </li>
    `).join('');
    elemento.innerHTML = '';
    elemento.appendChild(ul);
}

function criarListaFilmes(elemento, dados) {
    if (!elemento || !dados || dados.length === 0) return;
    const ul = document.createElement('ul');
    ul.className = 'lista';
    ul.innerHTML = dados.map(item => `
        <li>
            <a href="detalhes-filmes.html?id=${item.id}">
                <img src="${item.poster}" alt="${item.titulo}" loading="lazy">
                <span class="card-titulo">${item.titulo}</span>
            </a>
        </li>
    `).join('');
    elemento.innerHTML = '';
    elemento.appendChild(ul);
}

function carregarSeries() {
    Promise.all([
        getDados('/series/top5'),
        getDados('/series/lancamentos'),
        getDados('/series'),
    ]).then(([top5, lancamentos, series]) => {
        criarListaSeries(elementos.top5, top5);
        criarListaSeries(elementos.lancamentos, lancamentos);
        const idsUsados = [...top5.map(s => s.id), ...lancamentos.map(s => s.id)];
        const restantes = series.filter(s => !idsUsados.includes(s.id)).slice(0, 5);
        criarListaSeries(elementos.series, restantes);
    }).catch(err => console.error('Erro ao carregar series:', err));
}

function carregarFilmes() {
    if (!elementos.filmes) return;
    getDados('/filmes')
        .then(data => criarListaFilmes(elementos.filmes, data.slice(0, 5)))
        .catch(err => console.error('Erro ao carregar filmes:', err));
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsNormais = document.querySelectorAll('.section:not([data-name="categoria"])');

if (categoriaSelect) {
    categoriaSelect.addEventListener('change', function () {
        const cat = categoriaSelect.value;
        if (cat === 'todos') {
            sectionsNormais.forEach(s => s.classList.remove('hidden'));
            elementos.categoria.classList.add('hidden');
            return;
        }
        sectionsNormais.forEach(s => s.classList.add('hidden'));
        elementos.categoria.classList.remove('hidden');
        elementos.categoria.querySelector('h2').textContent =
            'Categoria: ' + cat.charAt(0).toUpperCase() + cat.slice(1);

        Promise.all([
            getDados('/series/categoria/' + encodeURIComponent(cat)),
            getDados('/filmes/categoria/' + encodeURIComponent(cat)),
        ]).then(([series, filmes]) => {
            criarListaSeries(elementos.categoria, [...series, ...filmes]);
        }).catch(err => console.error('Erro ao carregar categoria:', err));
    });
}

carregarSeries();
carregarFilmes();
inicializarBusca();
