const BASE_URL = "http://localhost:8080";

export function inicializarBusca() {
    const inputBusca = document.getElementById("input-busca");
    const btnBusca   = document.getElementById("btn-busca");
    const feedbackEl = document.getElementById("feedback-busca");

    if (!inputBusca || !btnBusca) return;

    btnBusca.addEventListener("click", () => executarBusca(inputBusca, feedbackEl));
    inputBusca.addEventListener("keydown", (e) => {
        if (e.key === "Enter") executarBusca(inputBusca, feedbackEl);
    });
}

async function executarBusca(inputEl, feedbackEl) {
    const titulo = inputEl.value.trim();
    if (!titulo) {
        mostrarFeedback(feedbackEl, "warning", "Digite um titulo para pesquisar.");
        return;
    }

    mostrarFeedback(feedbackEl, "loading", `Buscando "${titulo}"...`);
    inputEl.disabled = true;

    try {
        const response = await fetch(`${BASE_URL}/buscar?titulo=${encodeURIComponent(titulo)}`, {
            method: "POST",
        });

        const resultado = await response.json();

        switch (resultado.tipo) {
            case "serie":
                mostrarFeedback(feedbackEl, "sucesso", "Serie adicionada! Abrindo...");
                setTimeout(() => {
                    window.location.href = `detalhes.html?id=${resultado.serieId}`;
                }, 1200);
                break;

            case "serie_existente":
                mostrarFeedback(feedbackEl, "info", resultado.mensagem + " Abrindo...");
                setTimeout(() => {
                    window.location.href = `detalhes.html?id=${resultado.serieId}`;
                }, 1200);
                break;

            case "filme":
                mostrarFeedback(feedbackEl, "sucesso", "Filme adicionado! Abrindo...");
                setTimeout(() => {
                    window.location.href = `detalhes-filmes.html?id=${resultado.filmeId}`;
                }, 1200);
                break;

            case "filme_existente":
                mostrarFeedback(feedbackEl, "info", resultado.mensagem + " Abrindo...");
                setTimeout(() => {
                    window.location.href = `detalhes-filmes.html?id=${resultado.filmeId}`;
                }, 1200);
                break;

            default:
                mostrarFeedback(feedbackEl, "erro", resultado.mensagem || "Titulo nao encontrado.");
                inputEl.disabled = false;
                break;
        }
    } catch (err) {
        mostrarFeedback(feedbackEl, "erro", "Erro de conexao com o servidor.");
        inputEl.disabled = false;
        console.error("Erro na busca:", err);
    }
}

function mostrarFeedback(el, tipo, mensagem) {
    if (!el) return;
    el.textContent   = mensagem;
    el.className     = "feedback-busca feedback-" + tipo;
    el.style.display = "block";
    if (tipo !== "loading") {
        clearTimeout(el._timeout);
        el._timeout = setTimeout(() => { el.style.display = "none"; }, 4000);
    }
}
