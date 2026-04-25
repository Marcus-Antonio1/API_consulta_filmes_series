package br.com.markFilmes.principal;

import br.com.markFilmes.model.*;
import br.com.markFilmes.repository.FilmeRepository;
import br.com.markFilmes.repository.SerieRepository;
import br.com.markFilmes.service.ConsumoApi;
import br.com.markFilmes.service.ConverteDados;

import java.util.*;
import java.util.stream.Collectors;

public class Principal {

    private final String ENDERECO = "https://www.omdbapi.com/?t=";
    private final String API_KEY = "&apikey=6585022c";

    private Scanner leitura = new Scanner(System.in);
    private ConsumoApi consumo = new ConsumoApi();
    private ConverteDados conversor = new ConverteDados();

    private SerieRepository repositorioSerie;
    private FilmeRepository repositorioFilme;

    private List<Serie> series = new ArrayList<>();

    public Principal(SerieRepository repositorioSerie, FilmeRepository repositorioFilme) {
        this.repositorioSerie = repositorioSerie;
        this.repositorioFilme = repositorioFilme;
    }


    public void exibeMenu() {
        var opcao = -1;

        while (opcao != 0) {

            var menu = """
                    
                    1 - Buscar séries
                    2 - Buscar episódios
                    3 - Buscar filmes
                    4 - Listar séries buscadas
                    5 - Listar filmes buscados
                    6 - Buscar por ator
                    7 - Buscar top 5 títulos
                    
                    0 - Sair
                    """;

            System.out.println(menu);
            opcao = leitura.nextInt();
            leitura.nextLine();

            switch (opcao) {
                case 1:
                    buscarSerieWeb();
                    break;
                case 2:
                    buscarEpisodioPorSerie();
                    break;
                case 3:
                    buscarFilmeWeb();
                    break;
                case 4:
                    listarSeriesBuscadas();
                    break;
                case 5:
                    listarFilmesBuscados();
                    break;
                case 6:
                    buscarPorAtor();
                    break;
                case 7:
                    buscarTop5Titulos();
                    break;
                case 0:
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida");
            }
        }
    }

    // ========================= SÉRIE =========================

    private void buscarSerieWeb() {
        DadosSerie dados = getDadosSerie();
        Serie serie = new Serie(dados);
        repositorioSerie.save(serie);
        System.out.println(dados);

    }

    private DadosSerie getDadosSerie() {
        System.out.println("Digite o nome da série para busca:");
        var nomeSerie = leitura.nextLine();

        var json = consumo.obterDados(
                ENDERECO + nomeSerie.replace(" ", "+") + API_KEY
        );

        DadosSerie dados = conversor.obterDados(json, DadosSerie.class);

        dadosSeries.add(dados);

        return dados;
    }

    // ========================= EPISÓDIOS =========================

    private void buscarEpisodioPorSerie() {
        listarSeriesBuscadas();
        System.out.println("Escolha a série que deseja buscar os episódios: ");
        var nomeSerie = leitura.nextLine();

        Optional<Serie> serie = series.stream()
                .filter(s -> s.getTitulo().toLowerCase().contains(nomeSerie.toLowerCase()))
                .findFirst();

        if (serie.isPresent()) {

            var serieEncontrada = serie.get();
            List<DadosTemporada> temporadas = new ArrayList<>();

            for (int i = 1; i <= serieEncontrada.getTotalTemporadas(); i++) {

                var json = consumo.obterDados(
                        ENDERECO + serieEncontrada.getTitulo().replace(" ", "+")
                                + "&season=" + i + API_KEY
                );

                DadosTemporada temporada =
                        conversor.obterDados(json, DadosTemporada.class);

                temporadas.add(temporada);
            }

            temporadas.forEach(System.out::println);

            List<Episodio> episodios = temporadas.stream()
                    .flatMap(t -> t.episodios().stream()
                            .map(e -> new Episodio(t.numero(), e)))
                    .collect(Collectors.toList());

            serieEncontrada.setEpisodios(episodios);
            repositorioSerie.save(serieEncontrada);

        } else {
            System.out.println("Série não encontrada!");
        }
    }

    private List<DadosSerie> dadosSeries = new ArrayList<>();

    private void listarSeriesBuscadas() {
        series = repositorioSerie.findAll();

        if (series.isEmpty()) {
            System.out.println("Nenhuma série foi buscada ainda.");
            return;
        }

        series.stream()
                .sorted(Comparator.comparing(Serie::getGenero))
                .forEach(System.out::println);
    }

    // ========================= FILME =========================

    private void buscarFilmeWeb() {
        System.out.println("Digite o nome do filme para busca:");
        var nomeFilme = leitura.nextLine();

        var json = consumo.obterDados(
                ENDERECO + nomeFilme.replace(" ", "+") + API_KEY
        );

        DadosGerais geral = conversor.obterDados(json, DadosGerais.class);

        if (!geral.tipo().equalsIgnoreCase("movie")) {
            System.out.println("O título encontrado não é um filme.");
            return;
        }

        DadosFilme dados = conversor.obterDados(json, DadosFilme.class);

        Filme filme = new Filme(dados);

        repositorioFilme.save(filme);

        System.out.println(filme);
    }

    private void listarFilmesBuscados() {

        List<Filme> filmes = repositorioFilme.findAll();

        if (filmes.isEmpty()) {
            System.out.println("Nenhum filme foi salvo ainda.");
            return;
        }

        filmes.stream()
                .sorted(Comparator.comparing(Filme::getTitulo))
                .forEach(System.out::println);
    }

    // ========================= ATOR =========================

    private void buscarPorAtor() {
        System.out.println("Digite o nome do ator:");
        var nomeAtor = leitura.nextLine();

        List<Serie> series = repositorioSerie.findByAtoresContainingIgnoreCase(nomeAtor);
        List<Filme> filmes = repositorioFilme.findByAtoresContainingIgnoreCase(nomeAtor);

        if (series.isEmpty() && filmes.isEmpty()) {
            System.out.println("Nenhum título encontrado para esse ator.");
            return;
        }

        System.out.println("\n=== SÉRIES ===");
        series.forEach(System.out::println);

        System.out.println("\n=== FILMES ===");
        filmes.forEach(System.out::println);
    }

    // ========================= TOP 5 TITULOS =========================

    private void buscarTop5Titulos() {

        List<Serie> series = repositorioSerie.findAll();
        List<Filme> filmes = repositorioFilme.findAll();

        List<Object> titulos = new ArrayList<>();
        titulos.addAll(series);
        titulos.addAll(filmes);

        if (titulos.isEmpty()) {
            System.out.println("Nenhum título encontrado.");
            return;
        }

        titulos.stream()
                .sorted((t1, t2) -> {
                    Double nota1 = (t1 instanceof Serie)
                            ? ((Serie) t1).getAvaliacao()
                            : ((Filme) t1).getAvaliacao();

                    Double nota2 = (t2 instanceof Serie)
                            ? ((Serie) t2).getAvaliacao()
                            : ((Filme) t2).getAvaliacao();

                    return nota2.compareTo(nota1);
                })
                .limit(5)
                .forEach(t -> {
                    if (t instanceof Serie) {
                        System.out.println("Serie: " + t);
                    } else {
                        System.out.println("Filme: " + t);
                    }
                });
    }

}

