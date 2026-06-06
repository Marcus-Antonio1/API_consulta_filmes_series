package br.com.markFilmes.dto;
import br.com.markFilmes.model.Categoria;

public record SerieDTO(
    Long id,
    String titulo,
    Integer totalTemporadas,
    Double avaliacao,
    Categoria genero,
    String atores,
    String poster,
    String sinopse
) {}
