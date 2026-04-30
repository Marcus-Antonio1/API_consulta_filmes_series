const baseURL = 'http://localhost:8080';

export default function getDados(endpoint) {
    return fetch(`${baseURL}${endpoint}`)
        .then(response => {
            if (!response.ok) throw new Error("Erro HTTP: " + response.status);
            return response.json();
        })
        .catch(error => {
            console.error("Erro ao acessar " + endpoint + ":", error);
            throw error;
        });
}
