package br.com.markFilmes.principal;

import br.com.markFilmes.model.*;
import br.com.markFilmes.repository.FilmeRepository;
import br.com.markFilmes.repository.SerieRepository;
import br.com.markFilmes.service.ConsumoApi;
import br.com.markFilmes.service.ConverteDados;

import java.util.*;

public class Principal {

    private final String ENDERECO = "https://www.omdbapi.com/?t=";
    private final String API_KEY = "&apikey=6585022c";

    private Scanner leitura = new Scanner(System.in);
    private ConsumoApi consumo = new ConsumoApi();
    private ConverteDados conversor = new ConverteDados();

    private SerieRepository repositorioSerie;
    private FilmeRepository repositorioFilme;

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
        Serie serie = new Serie (dados);
        //dadosSeries.add(dados);
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
        DadosSerie dadosSerie = getDadosSerie();

        if (dadosSerie.totalTemporadas() == null) {
            System.out.println("Não foi possível obter temporadas.");
            return;
        }

        List<DadosTemporada> temporadas = new ArrayList<>();

        for (int i = 1; i <= dadosSerie.totalTemporadas(); i++) {
            var json = consumo.obterDados(
                    ENDERECO + dadosSerie.titulo().replace(" ", "+")
                            + "&season=" + i + API_KEY
            );

            DadosTemporada dadosTemporada =
                    conversor.obterDados(json, DadosTemporada.class);

            temporadas.add(dadosTemporada);
        }

        temporadas.forEach(System.out::println);
    }
    private List<DadosSerie> dadosSeries = new ArrayList<>();
    private void listarSeriesBuscadas(){
        List<Serie> series = dadosSeries.stream()
                .map(Serie::new)
                .toList();

        if (series.isEmpty()) {
            System.out.println("Nenhuma série foi buscada ainda.");
            return;
        }

        series.stream()
                .sorted(Comparator.comparing(Serie::getGenero))
                .forEach(System.out::println);
    }

    // ========================= FILME =========================
    private List<DadosFilme> dadosFilmes = new ArrayList<>();
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

        if (dadosFilmes.isEmpty()) {
            System.out.println("Nenhum filme foi buscado ainda.");
            return;
        }

        dadosFilmes.stream()
                .sorted(Comparator.comparing(DadosFilme::titulo))
                .forEach(System.out::println);
    }
}

