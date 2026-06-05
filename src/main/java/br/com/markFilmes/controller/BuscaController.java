package br.com.markFilmes.controller;

import br.com.markFilmes.service.BuscaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/buscar")
@Tag(name = "Busca", description = "Busca titulos na OMDB e salva no banco")
public class BuscaController {

    @Autowired
    private BuscaService buscaService;

    @PostMapping
    @Operation(summary = "Busca um titulo na OMDB pelo nome e salva no banco")
    public ResponseEntity<BuscaService.ResultadoBusca> buscar(@RequestParam String titulo) {
        if (titulo == null || titulo.isBlank()) {
            return ResponseEntity.badRequest()
                .body(new BuscaService.ResultadoBusca("erro", "Titulo nao informado.", null, null));
        }
        return ResponseEntity.ok(buscaService.buscar(titulo));
    }
}
