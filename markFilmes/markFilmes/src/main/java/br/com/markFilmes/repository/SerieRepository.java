package br.com.markFilmes.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.markFilmes.model.Serie;

public interface SerieRepository extends JpaRepository<Serie, Long>{

}
