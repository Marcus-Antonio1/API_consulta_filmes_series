const BASE_URL = 'http://localhost:8080';

export function inicializarBusca() {
  bindBusca(
    'input-busca',
    'btn-busca',
    'feedback-busca'
  );
}

export function inicializarHeroBusca() {
  bindBusca(
    'hero-input',
    'hero-btn',
    'hero-feedback'
  );
}

function bindBusca(inputId, btnId, feedbackId) {

  const input =
    document.getElementById(inputId);

  const btn =
    document.getElementById(btnId);

  const feedback =
    document.getElementById(feedbackId);

  if (!input || !btn) return;

  btn.addEventListener(
    'click',
    () => executarBusca(input, feedback)
  );

  input.addEventListener(
    'keydown',
    e => {
      if (e.key === 'Enter') {
        executarBusca(input, feedback);
      }
    }
  );
}

async function executarBusca(input, feedback) {

  const titulo =
    input.value.trim();

  if (!titulo) {

    mostrarFeedback(
      feedback,
      'warning',
      'Digite um título.'
    );

    return;
  }

  mostrarFeedback(
    feedback,
    'loading',
    'Buscando...'
  );

  try {

    const resposta = await fetch(
      `${BASE_URL}/buscar?titulo=${encodeURIComponent(titulo)}`,
      {
        method: 'POST'
      }
    );

    const dados =
      await resposta.json();

    mostrarResultadoBusca(dados);

    mostrarFeedback(
      feedback,
      'sucesso',
      'Resultado encontrado.'
    );

  } catch {

    mostrarFeedback(
      feedback,
      'erro',
      'Erro ao buscar.'
    );
  }
}

function mostrarResultadoBusca(item) {

  const secao = document.getElementById('resultado-busca');
  const lista = document.getElementById('resultado-lista');

  if (!secao || !lista) return;

  secao.classList.remove('hidden');

  let href = '#';
  let tipoTexto = '';

  switch (item.tipo) {

    case 'serie':
    case 'serie_existente':

      href = `detalhes.html?id=${item.serieId}`;
      tipoTexto = 'Série';

      break;

    case 'filme':
    case 'filme_existente':

      href = `detalhes-filmes.html?id=${item.filmeId}`;
      tipoTexto = 'Filme';

      break;

    default:

      lista.innerHTML = `
        <div class="resultado-vazio">
          Nenhum resultado encontrado.
        </div>
      `;

      return;
  }

  lista.innerHTML = `
    <div class="resultado-card">

      <img
        src="${item.poster}"
        alt="${item.titulo}"
        class="resultado-poster">

      <div class="resultado-info">

        <span class="resultado-tipo">
          ${tipoTexto}
        </span>

        <h3>
          ${item.titulo}
        </h3>

        <div class="resultado-nota">
          ⭐ ${item.avaliacao || '-'}
        </div>

        <p>
          ${item.mensagem}
        </p>

        <a
          href="${href}"
          class="resultado-btn">

          Ver detalhes

        </a>

      </div>

    </div>
  `;

  secao.scrollIntoView({
    behavior: 'smooth'
  });
}

function mostrarFeedback(
  elemento,
  tipo,
  mensagem
) {

  if (!elemento) return;

  elemento.style.display = 'block';

  elemento.className =
    `feedback-busca feedback-${tipo}`;

  elemento.textContent =
    mensagem;

  if (tipo !== 'loading') {

    clearTimeout(
      elemento._timeout
    );

    elemento._timeout =
      setTimeout(() => {

        elemento.style.display =
          'none';

      }, 4000);
  }
}

