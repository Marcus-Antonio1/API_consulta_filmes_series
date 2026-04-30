package br.com.markFilmes.controller;

import br.com.markFilmes.dto.EpisodioDTO;
import br.com.markFilmes.dto.SerieDTO;
import br.com.markFilmes.service.SerieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/series")
@RestController
public class SerieController {

    @Autowired
    private SerieService servico;

    @GetMapping
    public List<SerieDTO> obterSeries() {
        return servico.obterTodasAsSeries();
    }

    @GetMapping("/top5")
    public List<SerieDTO> obterTop5Series() {
        return servico.obterTop5Series();
    }

    @GetMapping("/lancamentos")
    public List<SerieDTO> obterLancamentos() {
        return servico.obterLancamentos();
    }

    @GetMapping("/{id}")
    public SerieDTO obterPorId(@PathVariable Long id) {
        return servico.obterPorId(id);
    }

    @GetMapping("/{id}/temporadas/todas")
    public List<EpisodioDTO> obterTemporadas(@PathVariable Long id) {
        return servico.obterTemporadas(id);
    }

    @GetMapping("/{id}/temporadas/{numero}")
    public List<EpisodioDTO> obterTemporadaPorNumero(
            @PathVariable Long id,
            @PathVariable String numero
    ) {
        List<EpisodioDTO> episodios = servico.obterTemporadas(id);
        if (numero.equalsIgnoreCase("todas")) return episodios;
        Integer temp = Integer.valueOf(numero);
        return episodios.stream()
                .filter(e -> e.temporada().equals(temp))
                .collect(Collectors.toList());
    }

    // NOVO: filtro por categoria
    @GetMapping("/categoria/{genero}")
    public List<SerieDTO> obterPorCategoria(@PathVariable String genero) {
        return servico.obterPorCategoria(genero);
    }
}
