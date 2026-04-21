package br.com.markFilmes.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DadosGerais(@JsonAlias("Title") String titulo,
                          @JsonAlias("Type") String tipo) {
}
