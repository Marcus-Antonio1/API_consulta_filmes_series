import getDados from './getDados.js';

// 1. Pega o ID da série pela URL (ex: detalhes.html?id=5)
const urlParams = new URLSearchParams(window.location.search);
const serieId = urlParams.get('id');

const breadcrumbTitulo = document.getElementById('breadcrumb-titulo');
const fichaDescricao = document.getElementById('ficha-descricao');
const temporadasSelect = document.getElementById('temporadas-select');
const episodiosContainer = document.getElementById('temporadas-episodios');

async function inicializarDetalhes() {
  if (!serieId) {
    console.error("ID da série não encontrado na URL.");
    return;
  }

  try {
    // 2. Busca os dados gerais da série
    const serie = await getDados(`/series/${serieId}`);
    
    // Preenche o topo da página
    if (breadcrumbTitulo) breadcrumbTitulo.textContent = serie.titulo;
    
    if (fichaDescricao) {
      fichaDescricao.innerHTML = `
        <div class="ficha-layout">
          <img src="${serie.poster}" alt="${serie.titulo}" class="ficha-poster">
          <div class="ficha-info">
            <h2>${serie.titulo}</h2>
            <p class="sinopse">${serie.sinopse || 'Sem sinopse disponível.'}</p>
            <p><strong>Gênero:</strong> ${serie.genero}</p>
            <p><strong>Avaliação:</strong> ⭐ ${serie.avaliacao}/10</p>
          </div>
        </div>
      `;
    }

    // Chamamos a função para buscar e listar as temporadas no Dropdown assim que a página abre
    carregarTemporadas();

    // Ouvinte de evento para quando o usuário mudar a opção do select
    if (temporadasSelect) {
      temporadasSelect.addEventListener('change', carregarEpisodios);
    }

  } catch (error) {
    console.error("Erro ao carregar detalhes da série:", error);
    if (fichaDescricao) fichaDescricao.innerHTML = '<p>Erro ao carregar dados da série.</p>';
  }
}

// Filtra as temporadas únicas para montar o Select
function carregarTemporadas() {
  getDados('/series/' + serieId + '/temporadas/todas')
    .then(eps => {
      if (!temporadasSelect) return;
      if (!eps || !eps.length) { 
        temporadasSelect.innerHTML = '<option>Sem temporadas</option>'; 
        return; 
      }
      
      // Obtém os números únicos das temporadas
      const unicas = [...new Set(eps.map(e => e.temporada))].sort((a, b) => a - b);
      
      temporadasSelect.innerHTML = '<option value="">Selecione a temporada</option>';
      
      unicas.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; 
        opt.textContent = 'Temporada ' + t;
        temporadasSelect.appendChild(opt);
      });
      
      const all = document.createElement('option');
      all.value = 'todas'; 
      all.textContent = 'Todas';
      temporadasSelect.appendChild(all);
    })
    .catch(console.error);
}

// Busca e renderiza os episódios com base na temporada selecionada
function carregarEpisodios() {
  if (!temporadasSelect || !episodiosContainer) return;
  
  const val = temporadasSelect.value;
  if (!val) {
    episodiosContainer.innerHTML = '';
    return;
  }
  
  getDados('/series/' + serieId + '/temporadas/' + val)
    .then(eps => {
      episodiosContainer.innerHTML = '';
      if (!eps || !eps.length) { 
        episodiosContainer.innerHTML = '<p>Nenhum episódio encontrado.</p>'; 
        return; 
      }
      
      const unicas = [...new Set(eps.map(e => e.temporada))].sort((a, b) => a - b);
      
      unicas.forEach(t => {
        const titulo = document.createElement('p');
        titulo.className = 'temporada-titulo';
        titulo.textContent = 'Temporada ' + t;
        episodiosContainer.appendChild(titulo);
        
        const ul = document.createElement('ul');
        ul.className = 'episodios-lista';
        ul.innerHTML = eps
          .filter(e => e.temporada === t)
          .map(e => `
            <li>
              <span class="ep-numero">Ep. ${e.numeroEpisodio}</span>
              <span class="ep-titulo">${e.titulo}</span>
            </li>
          `).join('');
          
        episodiosContainer.appendChild(ul);
      });
    })
    .catch(console.error);
}


inicializarDetalhes();