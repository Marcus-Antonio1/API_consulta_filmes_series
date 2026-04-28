package br.com.markFilmes.controller;

import br.com.markFilmes.model.Filme;
import br.com.markFilmes.repository.FilmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/filmes")
public class FilmeController {

    @Autowired
    private FilmeRepository repositorio;

    @GetMapping
    public List<Filme> obterFilmes() {
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
}
