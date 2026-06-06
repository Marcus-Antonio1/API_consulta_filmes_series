const BASE_URL = 'http://localhost:8080';

export function inicializarBusca() {
  _bind('header-input', 'header-btn', null, true);
}

export function inicializarHeroBusca() {
  _bind('hero-input', 'hero-btn', 'hero-feedback', false);
}

function _bind(inputId, btnId, fbId, redirectOnResult) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(btnId);
  const fb    = fbId ? document.getElementById(fbId) : null;
  if (!input || !btn) return;
  btn.addEventListener('click', () => _exec(input, fb, redirectOnResult));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') _exec(input, fb, redirectOnResult); });
}

async function _exec(inputEl, fbEl, redirectOnResult) {
  const titulo = inputEl.value.trim();
  if (!titulo) { _fb(fbEl, 'warning', 'Digite um título.'); return; }
  _fb(fbEl, 'loading', `Buscando "${titulo}"...`);
  inputEl.disabled = true;
  try {
    const res  = await fetch(`${BASE_URL}/buscar?titulo=${encodeURIComponent(titulo)}`, { method: 'POST' });
    const data = await res.json();
    inputEl.disabled = false;
    inputEl.value = '';
    switch (data.tipo) {
      case 'serie':
      case 'serie_existente':
        _fb(fbEl, 'sucesso', 'Série encontrada! Abrindo...');
        setTimeout(() => window.location.href = `detalhes.html?id=${data.serieId}`, 1100);
        break;
      case 'filme':
      case 'filme_existente':
        _fb(fbEl, 'sucesso', 'Filme encontrado! Abrindo...');
        setTimeout(() => window.location.href = `detalhes-filmes.html?id=${data.filmeId}`, 1100);
        break;
      default:
        _fb(fbEl, 'erro', data.mensagem || 'Título não encontrado.');
    }
  } catch {
    inputEl.disabled = false;
    _fb(fbEl, 'erro', 'Erro de conexão com o servidor.');
  }
}

function _fb(el, tipo, msg) {
  if (!el) return;
  el.textContent  = msg;
  el.className    = 'feedback-busca feedback-' + tipo;
  el.style.display = 'block';
  if (tipo !== 'loading') {
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 4000);
  }
}
