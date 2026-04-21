package br.com.markFilmes.principal;

import br.com.markFilmes.model.DadosFilme;
import br.com.markFilmes.model.DadosGerais;
import br.com.markFilmes.model.DadosSerie;
import br.com.markFilmes.model.DadosTemporada;
import br.com.markFilmes.service.ConsumoApi;
import br.com.markFilmes.service.ConverteDados;

import javax.sound.midi.Soundbank;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

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

        } else if (geral.tipo().equalsIgnoreCase("movie")) {

            DadosFilme filme = conversor.obterDados(json, DadosFilme.class);
            System.out.println(filme);

        } else {
            System.out.println("Tipo não reconhecido.");
        }
    }
}
