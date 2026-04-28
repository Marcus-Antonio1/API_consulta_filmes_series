package br.com.markFilmes.service;

import br.com.markFilmes.dto.EpisodioDTO;
import br.com.markFilmes.dto.SerieDTO;
import br.com.markFilmes.model.Serie;
import br.com.markFilmes.repository.SerieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class SerieService {

    @Autowired
    private SerieRepository repositorio;


    public List<SerieDTO> obterTodasAsSeries(){
        return repositorio.findAll()
                .stream()
                .map(s -> new SerieDTO(s.getId(), s.getTitulo(), s.getTotalTemporadas(), s.getAvaliacao(), s.getGenero(), s.getAtores(), s.getPoster(), s.getSinopse()))
                .collect(Collectors.toList());
    }

    public List<SerieDTO> obterTop5Series() {
        return converteDados(repositorio.findTop5ByOrderByAvaliacaoDesc());
    }

    private List<SerieDTO> converteDados(List<Serie> series) {
        return series.stream()
                .map(s -> new SerieDTO(s.getId(), s.getTitulo(), s.getTotalTemporadas(), s.getAvaliacao(), s.getGenero(), s.getAtores(), s.getPoster(), s.getSinopse()))
                .collect(Collectors.toList());
    }

    public SerieDTO obterPorId(Long id) {
        Optional<Serie> serie = repositorio.findById(id);


        if (serie.isPresent()) {
            Serie s = serie.get();
            return new SerieDTO(s.getId(), s.getTitulo(), s.getTotalTemporadas(), s.getAvaliacao(), s.getGenero(), s.getAtores(), s.getPoster(), s.getSinopse());
        }
        return null;
    }

    public List<SerieDTO> obterLancamentos() {
        return converteDados(repositorio.findTop2ByOrderByIdDesc());
    }

    public List<EpisodioDTO> obterTemporadas(Long id) {
        Optional<Serie> serie = repositorio.findById(id);

        if (serie.isEmpty()) return List.of();

        return serie.get().getEpisodios().stream()
                .map(e -> new EpisodioDTO(
                        e.getTemporada(),
                        e.getTitulo(),
                        e.getNumeroEpisodio()
                ))
                .collect(Collectors.toList());
    }

}


