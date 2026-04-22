package br.com.markFilmes.principal;

import br.com.markFilmes.model.*;
import br.com.markFilmes.service.ConsumoApi;
import br.com.markFilmes.service.ConverteDados;

import javax.sound.midi.Soundbank;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class Principal {

    private final String ENDERECO = "https://www.omdbapi.com/?t=";
    private final String API_KEY = "&apikey=6585022c";
    private Scanner leitura = new Scanner(System.in);
    private ConsumoApi consumo = new ConsumoApi();
    private ConverteDados conversor = new ConverteDados();

    public void exibeMenu() {
        System.out.println("Digite o nome do filme ou série que deseja buscar: ");
        var nomeTitulo = leitura.nextLine();

        var json = consumo.obterDados(
                ENDERECO + nomeTitulo.replace(" ", "+") + API_KEY
        );

        // Primeiro descobre o tipo
        DadosGerais geral = conversor.obterDados(json, DadosGerais.class);

        if (geral.tipo().equalsIgnoreCase("series")) {

            DadosSerie dados = conversor.obterDados(json, DadosSerie.class);
            System.out.println(dados);

            List<DadosTemporada> temporadas = new ArrayList<>();

            for (int i = 1; i <= dados.totalTemporadas(); i++) {
                var jsonTemporada = consumo.obterDados(
                        ENDERECO + nomeTitulo.replace(" ", "+") +
                                "&Season=" + i + API_KEY
                );

                DadosTemporada temp = conversor.obterDados(jsonTemporada, DadosTemporada.class);
                temporadas.add(temp);
            }

            temporadas.forEach(System.out::println);
            temporadas.forEach(t -> t.episodios().forEach(e -> System.out.println(e.titulo())));

            List<DadosEpisodio> dadosEpisodios = temporadas.stream()
                    .flatMap(t -> t.episodios().stream())
                            .collect(Collectors.toList());

            System.out.println("\nTop 5 melhores episódios:");
            dadosEpisodios.stream()
                    .filter(e -> !e.avaliacao().equalsIgnoreCase("N/A"))
                    .sorted(Comparator.comparing(DadosEpisodio::avaliacao).reversed())
                    .limit(5)
                    .forEach(System.out::println);

            List<Episodio> episodios = temporadas.stream()
                    .flatMap(t -> t.episodios().stream()
                            .map(d -> new Episodio(t.numero(),d))
                    ).collect(Collectors.toList());
            episodios.forEach(System.out::println);

            System.out.println("Digite um trecho do titulo do episódio: ");
            var trechoTitulo = leitura.nextLine();
            Optional<Episodio> episodioBuscado = episodios.stream()
                    .filter(e -> e.getTitulo().toUpperCase().contains(trechoTitulo.toUpperCase()))
                    .findFirst();
            if (episodioBuscado.isPresent()){
                System.out.println("Episódio encontrado: ");
                System.out.println("Temporada " + episodioBuscado.get().getTemporada());
            } else {
                System.out.println("Episódio não encontrado!");
            }


            System.out.println("A partir de qual ano você deseja ver os episódios? ");
            var ano = Integer.parseInt(leitura.nextLine());
            leitura.nextLine();
            LocalDate dataBusca = LocalDate.of(ano, 1, 1);

            DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            episodios.stream()
                    .filter(e -> e.getDataDeLancamento() != null && e.getDataDeLancamento().isAfter(dataBusca))
                    .forEach(e -> {
                        System.out.println(
                                "Temporada: " + e.getTemporada() +
                                        " Episódio: " + e.getTitulo() +
                                        " Data de lançamento: " + e.getDataDeLancamento().format(formatador)
                        );
                    });

            Map<Integer, Double> avaliacoesPorTemporada = episodios.stream()
                    .filter(e -> e.getAvaliacao() > 0.0)
                    .collect(Collectors.groupingBy(Episodio::getTemporada,
                            Collectors.averagingDouble(Episodio::getAvaliacao)));
            System.out.println(avaliacoesPorTemporada);

            DoubleSummaryStatistics est = episodios.stream()
                    .filter(e -> e.getAvaliacao() > 0.0)
                    .collect(Collectors.summarizingDouble(Episodio::getAvaliacao));
            System.out.println("Média: " + est.getAverage());
            System.out.println("Melhor episódio: " + est.getMax());
            System.out.println("Pior episódio: " + est.getMin());
            System.out.println("Quantidade de episódios avaliados: " + est.getCount());


        } else if (geral.tipo().equalsIgnoreCase("movie")) {

            DadosFilme filme = conversor.obterDados(json, DadosFilme.class);
            System.out.println(filme);

        } else {
            System.out.println("Tipo não reconhecido.");
        }
    }
}
