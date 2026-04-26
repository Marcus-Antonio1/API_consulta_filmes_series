package br.com.markFilmes.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SerieController {

    @GetMapping
    public String obterSeries(){
        return "Séries exibidas";
    }
}
