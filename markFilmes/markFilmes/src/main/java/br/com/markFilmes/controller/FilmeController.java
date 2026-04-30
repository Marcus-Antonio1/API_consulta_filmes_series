package br.com.markFilmes.controller;

import br.com.markFilmes.model.Categoria;
import br.com.markFilmes.model.Filme;
import br.com.markFilmes.repository.FilmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/filmes")
public class FilmeController {

    @Autowired
    private FilmeRepository repositorio;

    // BUG CORRIGIDO: antes não tinha @PathVariable e devolvia findAll()
    @GetMapping("/{id}")
    public Filme obterFilmePorId(@PathVariable Long id) {
        Optional<Filme> filme = repositorio.findById(id);
        return filme.orElse(null);
    }

    // BUG CORRIGIDO: endpoint GET /filmes não existia — filmes nunca apareciam
    @GetMapping
    public List<Filme> obterTodosOsFilmes() {
        return repositorio.findAll();
    }

    @GetMapping("/top5")
    public List<Filme> top5() {
        return repositorio.findTop5ByOrderByAvaliacaoDesc();
    }

    @GetMapping("/lancamentos")
    public List<Filme> lancamentos() {
        return repositorio.findTop2ByOrderByIdDesc();
    }

    // NOVO: filtro por categoria
    @GetMapping("/categoria/{genero}")
    public List<Filme> filmePorCategoria(@PathVariable String genero) {
        try {
            Categoria categoria = Categoria.fromPortugues(genero);
            return repositorio.findByGenero(categoria);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
}
