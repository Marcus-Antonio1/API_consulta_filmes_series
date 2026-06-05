package br.com.markFilmes.controller;

import br.com.markFilmes.model.Categoria;
import br.com.markFilmes.model.Filme;
import br.com.markFilmes.repository.FilmeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/filmes")
@Tag(name = "Filmes", description = "Endpoints para gerenciamento de filmes")
public class FilmeController {

    @Autowired
    private FilmeRepository repositorio;

    @GetMapping
    @Operation(summary = "Lista todos os filmes")
    public List<Filme> obterTodosOsFilmes() {
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um filme pelo ID")
    public Filme obterFilmePorId(@PathVariable Long id) {
        Optional<Filme> filme = repositorio.findById(id);
        return filme.orElse(null);
    }

    @GetMapping("/top5")
    @Operation(summary = "Top 5 filmes por avaliacao")
    public List<Filme> top5() {
        return repositorio.findTop5ByOrderByAvaliacaoDesc();
    }

    @GetMapping("/lancamentos")
    @Operation(summary = "Ultimos 2 filmes adicionados")
    public List<Filme> lancamentos() {
        return repositorio.findTop2ByOrderByIdDesc();
    }

    @GetMapping("/categoria/{genero}")
    @Operation(summary = "Filtra filmes por genero (em portugues)")
    public List<Filme> filmePorCategoria(@PathVariable String genero) {
        try {
            Categoria categoria = Categoria.fromPortugues(genero);
            return repositorio.findByGenero(categoria);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
}
