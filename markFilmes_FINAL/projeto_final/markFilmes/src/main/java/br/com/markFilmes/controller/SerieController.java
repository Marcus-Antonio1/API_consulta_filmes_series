package br.com.markFilmes.controller;

import br.com.markFilmes.dto.EpisodioDTO;
import br.com.markFilmes.dto.SerieDTO;
import br.com.markFilmes.service.SerieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/series")
@Tag(name = "Series", description = "Endpoints para gerenciamento de series")
public class SerieController {

    @Autowired
    private SerieService servico;

    @GetMapping
    @Operation(summary = "Lista todas as series")
    public List<SerieDTO> obterSeries() {
        return servico.obterTodasAsSeries();
    }

    @GetMapping("/top5")
    @Operation(summary = "Top 5 series por avaliacao")
    public List<SerieDTO> obterTop5Series() {
        return servico.obterTop5Series();
    }

    @GetMapping("/lancamentos")
    @Operation(summary = "Ultimas 2 series adicionadas")
    public List<SerieDTO> obterLancamentos() {
        return servico.obterLancamentos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma serie pelo ID")
    public SerieDTO obterPorId(@PathVariable Long id) {
        return servico.obterPorId(id);
    }

    @GetMapping("/{id}/temporadas/todas")
    @Operation(summary = "Lista todos os episodios de uma serie")
    public List<EpisodioDTO> obterTemporadas(@PathVariable Long id) {
        return servico.obterTemporadas(id);
    }

    @GetMapping("/{id}/temporadas/{numero}")
    @Operation(summary = "Lista episodios de uma temporada especifica")
    public List<EpisodioDTO> obterTemporadaPorNumero(
            @PathVariable Long id, @PathVariable String numero) {
        List<EpisodioDTO> episodios = servico.obterTemporadas(id);
        if (numero.equalsIgnoreCase("todas")) return episodios;
        Integer temp = Integer.valueOf(numero);
        return episodios.stream()
                .filter(e -> e.temporada().equals(temp))
                .collect(Collectors.toList());
    }

    @GetMapping("/categoria/{genero}")
    @Operation(summary = "Filtra series por genero (em portugues)")
    public List<SerieDTO> obterPorCategoria(@PathVariable String genero) {
        return servico.obterPorCategoria(genero);
    }
}
