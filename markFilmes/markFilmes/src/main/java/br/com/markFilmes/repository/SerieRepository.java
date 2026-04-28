package br.com.markFilmes.repository;
import br.com.markFilmes.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.markFilmes.model.Serie;

import java.util.List;
import java.util.Optional;

public interface SerieRepository extends JpaRepository<Serie, Long>{
    Optional <Serie> findByTituloContainingIgnoreCase(String nomeSerie);

    List<Serie> findByAtoresContainingIgnoreCase(String nomeAtor);
    List<Serie> findByGenero(Categoria genero);
    List<Serie> findTop5ByOrderByAvaliacaoDesc();
    List<Serie> findTop2ByOrderByIdDesc();
}
