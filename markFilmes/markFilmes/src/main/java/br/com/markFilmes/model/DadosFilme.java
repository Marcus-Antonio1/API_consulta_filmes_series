package br.com.markFilmes.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DadosFilme(@JsonAlias("Title") String titulo,
                         @JsonAlias("Runtime") String duracaoFilme,
                         @JsonAlias("imdbRating") String avaliacao,
                         @JsonAlias("Year") int anoLancamento) {
}
