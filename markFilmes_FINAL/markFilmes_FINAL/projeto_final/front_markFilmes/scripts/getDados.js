const BASE_URL = 'http://localhost:8080';
export default function getDados(endpoint) {
  return fetch(`${BASE_URL}${endpoint}`)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
}
