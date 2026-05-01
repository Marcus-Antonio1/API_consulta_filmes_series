package br.com.markFilmes.service;

import br.com.markFilmes.model.*;
import br.com.markFilmes.repository.FilmeRepository;
import br.com.markFilmes.repository.SerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Responsável por buscar títulos na API OMDB, salvar no banco
 * e retornar o resultado tudo sem precisar do menu do Principal.java.
 */
@Service
public class BuscaService {

    private final String ENDERECO = "https://www.omdbapi.com/?t=";
    private final String API_KEY  = "&apikey=6585022c";

    @Autowired
    private SerieRepository serieRepository;

    @Autowired
    private FilmeRepository filmeRepository;

    private final ConsumoApi consumo      = new ConsumoApi();
    private final ConverteDados conversor = new ConverteDados();

    // ── Ponto de entrada: decide se é série ou filme ──────────────────────────

    public ResultadoBusca buscar(String titulo) {
        String url  = ENDERECO + titulo.trim().replace(" ", "+") + API_KEY;
        String json = consumo.obterDados(url);

        DadosGerais geral = conversor.obterDados(json, DadosGerais.class);

        if (geral == null || geral.titulo() == null) {
            return new ResultadoBusca("erro", "Título não encontrado na OMDB.", null, null);
        }

        String tipo = geral.tipo() != null ? geral.tipo().toLowerCase() : "";

        return switch (tipo) {
            case "series" -> buscarESalvarSerie(json, geral.titulo());
            case "movie"  -> buscarESalvarFilme(json, geral.titulo());
            default       -> new ResultadoBusca("erro", "Tipo desconhecido: " + tipo, null, null);
        };
    }

    // ── Série ─────────────────────────────────────────────────────────────────

    private ResultadoBusca buscarESalvarSerie(String json, String tituloOmdb) {

        Optional<Serie> existente = serieRepository.findByTituloContainingIgnoreCase(tituloOmdb);
        if (existente.isPresent()) {
            return new ResultadoBusca("serie_existente",
                    "Série já está no banco: " + existente.get().getTitulo(),
                    existente.get().getId(), null);
        }

        DadosSerie dadosSerie = conversor.obterDados(json, DadosSerie.class);
        Serie serie = new Serie(dadosSerie);
        serieRepository.save(serie); // salva primeiro para gerar o id

        // Busca episódios de todas as temporadas
        List<DadosTemporada> temporadas = java.util.stream.IntStream
                .rangeClosed(1, serie.getTotalTemporadas())
                .mapToObj(i -> {
                    String urlTemp = ENDERECO
                            + serie.getTitulo().replace(" ", "+")
                            + "&season=" + i + API_KEY;
                    return conversor.obterDados(consumo.obterDados(urlTemp), DadosTemporada.class);
                })
                .collect(Collectors.toList());

        List<Episodio> episodios = temporadas.stream()
                .flatMap(t -> t.episodios().stream().map(e -> new Episodio(t.numero(), e)))
                .collect(Collectors.toList());

        serie.setEpisodios(episodios);
        serieRepository.save(serie);

        return new ResultadoBusca("serie", "Série salva com sucesso!", serie.getId(), null);
    }

    // ── Filme ─────────────────────────────────────────────────────────────────

    private ResultadoBusca buscarESalvarFilme(String json, String tituloOmdb) {

        boolean jaExiste = filmeRepository.findAll().stream()
                .anyMatch(f -> f.getTitulo().equalsIgnoreCase(tituloOmdb));

        if (jaExiste) {
            Filme f = filmeRepository.findAll().stream()
                    .filter(x -> x.getTitulo().equalsIgnoreCase(tituloOmdb))
                    .findFirst().orElseThrow();
            return new ResultadoBusca("filme_existente",
                    "Filme já está no banco: " + f.getTitulo(), null, f.getId());
        }

        DadosFilme dadosFilme = conversor.obterDados(json, DadosFilme.class);
        Filme filme = new Filme(dadosFilme);
        filmeRepository.save(filme);

        return new ResultadoBusca("filme", "Filme salvo com sucesso!", null, filme.getId());
    }

    // ── DTO de retorno ────────────────────────────────────────────────────────
    // tipo: "serie" | "serie_existente" | "filme" | "filme_existente" | "erro"
    // serieId / filmeId: usado pelo front para redirecionar à página de detalhes
    public record ResultadoBusca(String tipo, String mensagem, Long serieId, Long filmeId) {}
}
