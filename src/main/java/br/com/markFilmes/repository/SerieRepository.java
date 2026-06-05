package br.com.markFilmes.repository;

import br.com.markFilmes.model.Categoria;
import br.com.markFilmes.model.Serie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SerieRepository extends JpaRepository<Serie, Long> {
    List<Serie> findTop5ByOrderByAvaliacaoDesc();
    List<Serie> findTop2ByOrderByIdDesc();
    List<Serie> findByGenero(Categoria genero);
    Optional<Serie> findByTituloContainingIgnoreCase(String titulo);
}
