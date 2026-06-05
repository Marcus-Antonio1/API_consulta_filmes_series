package br.com.markFilmes.repository;

import br.com.markFilmes.model.Categoria;
import br.com.markFilmes.model.Filme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FilmeRepository extends JpaRepository<Filme, Long> {
    List<Filme> findTop5ByOrderByAvaliacaoDesc();
    List<Filme> findTop2ByOrderByIdDesc();
    List<Filme> findByGenero(Categoria genero);
}
