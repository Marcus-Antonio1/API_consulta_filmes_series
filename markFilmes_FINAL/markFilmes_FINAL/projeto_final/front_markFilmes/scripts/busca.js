const BASE_URL = 'http://localhost:8080';

export function inicializarBusca() {
  _bind('input-busca', 'btn-busca', 'feedback-busca');
}

export function inicializarHeroBusca() {
  _bind('hero-input', 'hero-btn', 'hero-feedback');
}

function _bind(inputId, btnId, fbId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(btnId);
  const fb    = document.getElementById(fbId);
  if (!input || !btn) return;
  btn.addEventListener('click', () => _executar(input, fb));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') _executar(input, fb); });
}

async function _executar(inputEl, fbEl) {
  const titulo = inputEl.value.trim();
  if (!titulo) { _feedback(fbEl, 'warning', 'Digite um titulo.'); return; }
  _feedback(fbEl, 'loading', `Buscando "${titulo}"...`);
  inputEl.disabled = true;
  try {
    const res  = await fetch(`${BASE_URL}/buscar?titulo=${encodeURIComponent(titulo)}`, { method: 'POST' });
    const data = await res.json();
    switch (data.tipo) {
      case 'serie':
        _feedback(fbEl, 'sucesso', 'Serie adicionada! Abrindo...');
        setTimeout(() => { window.location.href = `detalhes.html?id=${data.serieId}`; }, 1200);
        break;
      case 'serie_existente':
        _feedback(fbEl, 'info', data.mensagem + ' Abrindo...');
        setTimeout(() => { window.location.href = `detalhes.html?id=${data.serieId}`; }, 1200);
        break;
      case 'filme':
        _feedback(fbEl, 'sucesso', 'Filme adicionado! Abrindo...');
        setTimeout(() => { window.location.href = `detalhes-filmes.html?id=${data.filmeId}`; }, 1200);
        break;
      case 'filme_existente':
        _feedback(fbEl, 'info', data.mensagem + ' Abrindo...');
        setTimeout(() => { window.location.href = `detalhes-filmes.html?id=${data.filmeId}`; }, 1200);
        break;
      default:
        _feedback(fbEl, 'erro', data.mensagem || 'Titulo nao encontrado.');
        inputEl.disabled = false;
    }
  } catch {
    _feedback(fbEl, 'erro', 'Erro de conexao com o servidor.');
    inputEl.disabled = false;
  }
}

function _feedback(el, tipo, msg) {
  if (!el) return;
  el.textContent  = msg;
  el.className    = 'feedback-busca feedback-' + tipo;
  el.style.display = 'block';
  if (tipo !== 'loading') {
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 4000);
  }
}
