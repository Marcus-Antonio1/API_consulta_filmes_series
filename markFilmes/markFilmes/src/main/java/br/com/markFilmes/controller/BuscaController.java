package br.com.markFilmes.controller;

import br.com.markFilmes.service.BuscaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/buscar")
public class BuscaController {

    @Autowired
    private BuscaService buscaService;

    @PostMapping
    public ResponseEntity<BuscaService.ResultadoBusca> buscar(@RequestParam String titulo) {
        if (titulo == null || titulo.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new BuscaService.ResultadoBusca("erro", "Título não informado.", null, null));
        }
        BuscaService.ResultadoBusca resultado = buscaService.buscar(titulo);
        return ResponseEntity.ok(resultado);
    }
}
