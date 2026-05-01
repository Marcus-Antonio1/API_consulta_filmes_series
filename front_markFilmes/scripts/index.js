import getDados from "./getDados.js";
import { inicializarBusca } from "./busca.js";

const elementos = {
    top5:        document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series:      document.querySelector('[data-name="series"]'),
    filmes:      document.querySelector('[data-name="filmes"]'),
    categoria:   document.querySelector('[data-name="categoria"]'),
    separador:   document.querySelector('[data-separador]'),
};

function criarListaSeries(elemento, dados) {
    if (!elemento) return;
    if (!dados || dados.length === 0) {
        elemento.style.display = 'none';
        return;
    }
    elemento.style.display = '';

    const h2 = document.createElement('h2');
    h2.textContent = elemento.dataset.titulo || '';

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
    elemento.appendChild(h2);
    elemento.appendChild(ul);
}

function criarListaFilmes(elemento, dados) {
    if (!elemento) return;
    if (!dados || dados.length === 0) {
        elemento.style.display = 'none';
        return;
    }
    elemento.style.display = '';

    const h2 = document.createElement('h2');
    h2.textContent = elemento.dataset.titulo || '';

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
    elemento.appendChild(h2);
    elemento.appendChild(ul);
}

function carregarSeries() {
    Promise.all([
        getDados('/series/top5'),
        getDados('/series/lancamentos'),
        getDados('/series'),
    ]).then(([top5, lancamentos, series]) => {
        criarListaSeries(elementos.lancamentos, lancamentos);
        criarListaSeries(elementos.top5, top5);

        const idsUsados = [...top5.map(s => s.id), ...lancamentos.map(s => s.id)];
        const restantes = series.filter(s => !idsUsados.includes(s.id)).slice(0, 8);
        criarListaSeries(elementos.series, restantes);
    }).catch(err => console.error('Erro ao carregar series:', err));
}

function carregarFilmes() {
    if (!elementos.filmes) return;
    getDados('/filmes')
        .then(data => criarListaFilmes(elementos.filmes, data.slice(0, 8)))
        .catch(err => console.error('Erro ao carregar filmes:', err));
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsNormais = document.querySelectorAll('.section, [data-separador]');

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
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        elementos.categoria.querySelector('h2').textContent = 'Categoria: ' + label;

        Promise.all([
            getDados('/series/categoria/' + encodeURIComponent(cat)),
            getDados('/filmes/categoria/' + encodeURIComponent(cat)),
        ]).then(([series, filmes]) => {
            const todos = [...series, ...filmes];

            const ulExistente = elementos.categoria.querySelector('ul');
            if (ulExistente) ulExistente.remove();

            if (todos.length === 0) {
                elementos.categoria.querySelector('h2').textContent =
                    'Nenhum titulo encontrado para: ' + label;
                return;
            }

            const ul = document.createElement('ul');
            ul.className = 'lista';
            ul.innerHTML = todos.map(item => {
                const href = item.totalTemporadas !== undefined
                    ? 'detalhes.html?id=' + item.id
                    : 'detalhes-filmes.html?id=' + item.id;
                return `<li><a href="${href}">
                    <img src="${item.poster}" alt="${item.titulo}" loading="lazy">
                    <span class="card-titulo">${item.titulo}</span>
                </a></li>`;
            }).join('');

            elementos.categoria.appendChild(ul);
        }).catch(err => console.error('Erro ao carregar categoria:', err));
    });
}

carregarSeries();
carregarFilmes();
inicializarBusca();
