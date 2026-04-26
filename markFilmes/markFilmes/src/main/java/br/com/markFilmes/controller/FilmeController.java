package br.com.markFilmes.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FilmeController {

    @GetMapping
    public String obterFilmes(){
        return "Filmes exibidas";
    }
}
