package br.com.markFilmes.service;

import br.com.markFilmes.model.*;
import br.com.markFilmes.repository.FilmeRepository;
import br.com.markFilmes.repository.SerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BuscaService {

    @Value("${omdb.api.url}")
    private String omdbUrl;

    @Value("${omdb.api.key}")
    private String omdbKey;

    @Autowired private SerieRepository serieRepository;
    @Autowired private FilmeRepository filmeRepository;

    private final ConsumoApi consumo      = new ConsumoApi();
    private final ConverteDados conversor = new ConverteDados();

    public ResultadoBusca buscar(String titulo) {
        String url  = omdbUrl + titulo.trim().replace(" ", "+") + "&apikey=" + omdbKey;
        String json = consumo.obterDados(url);
        DadosGerais geral = conversor.obterDados(json, DadosGerais.class);

        if (geral == null || geral.titulo() == null) {
            return new ResultadoBusca("erro", "Titulo nao encontrado na OMDB.", null, null);
        }

        String tipo = geral.tipo() != null ? geral.tipo().toLowerCase() : "";
        return switch (tipo) {
            case "series" -> buscarESalvarSerie(json, geral.titulo());
            case "movie"  -> buscarESalvarFilme(json, geral.titulo());
            default       -> new ResultadoBusca("erro", "Tipo desconhecido: " + tipo, null, null);
        };
    }

    private ResultadoBusca buscarESalvarSerie(String json, String tituloOmdb) {
        Optional<Serie> existente = serieRepository.findByTituloContainingIgnoreCase(tituloOmdb);
        if (existente.isPresent()) {
            return new ResultadoBusca("serie_existente",
                "Serie ja esta no banco: " + existente.get().getTitulo(),
                existente.get().getId(), null);
        }
        DadosSerie dadosSerie = conversor.obterDados(json, DadosSerie.class);
        Serie serie = new Serie(dadosSerie);
        serieRepository.save(serie);

        List<DadosTemporada> temporadas = java.util.stream.IntStream
            .rangeClosed(1, serie.getTotalTemporadas())
            .mapToObj(i -> {
                String urlTemp = omdbUrl + serie.getTitulo().replace(" ", "+")
                    + "&season=" + i + "&apikey=" + omdbKey;
                return conversor.obterDados(consumo.obterDados(urlTemp), DadosTemporada.class);
            })
            .collect(Collectors.toList());

        List<Episodio> episodios = temporadas.stream()
            .flatMap(t -> t.episodios().stream().map(e -> {
                Episodio ep = new Episodio(t.numero(), e);
                ep.setSerie(serie);
                return ep;
            }))
            .collect(Collectors.toList());

        serie.setEpisodios(episodios);
        serieRepository.save(serie);
        return new ResultadoBusca("serie", "Serie salva com sucesso!", serie.getId(), null);
    }

    private ResultadoBusca buscarESalvarFilme(String json, String tituloOmdb) {
        boolean jaExiste = filmeRepository.findAll().stream()
            .anyMatch(f -> f.getTitulo().equalsIgnoreCase(tituloOmdb));
        if (jaExiste) {
            Filme f = filmeRepository.findAll().stream()
                .filter(x -> x.getTitulo().equalsIgnoreCase(tituloOmdb))
                .findFirst().orElseThrow();
            return new ResultadoBusca("filme_existente",
                "Filme ja esta no banco: " + f.getTitulo(), null, f.getId());
        }
        DadosFilme dadosFilme = conversor.obterDados(json, DadosFilme.class);
        Filme filme = new Filme(dadosFilme);
        filmeRepository.save(filme);
        return new ResultadoBusca("filme", "Filme salvo com sucesso!", null, filme.getId());
    }

    public record ResultadoBusca(String tipo, String mensagem, Long serieId, Long filmeId) {}
}
