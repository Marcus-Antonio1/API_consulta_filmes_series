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


    @GetMapping("/{id}")
    public Filme obterFilmePorId(@PathVariable Long id) {
        Optional<Filme> filme = repositorio.findById(id);
        return filme.orElse(null);
    }

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
