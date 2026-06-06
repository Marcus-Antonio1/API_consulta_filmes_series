package br.com.markFilmes.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DadosFilme(
    @JsonAlias("Title")      String titulo,
    @JsonAlias("Year")       Integer anoLancamento,
    @JsonAlias("Runtime")    String duracaoFilme,
    @JsonAlias("imdbRating") String avaliacao,
    @JsonAlias("Genre")      String genero,
    @JsonAlias("Actors")     String atores,
    @JsonAlias("Poster")     String poster,
    @JsonAlias("Plot")       String sinopse
) {}
