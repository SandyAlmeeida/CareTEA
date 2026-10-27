package com.caretea.controller;

import com.caretea.dto.PessoaAutistaRequestDTO;
import com.caretea.dto.PessoaAutistaResponseDTO;
import com.caretea.service.PessoaAutistaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pessoas-autistas/vinculo")
public class PessoaAutistaVinculoController {

    private final PessoaAutistaService pessoaAutistaService;

    public PessoaAutistaVinculoController(
            PessoaAutistaService pessoaAutistaService
    ) {
        this.pessoaAutistaService =
                pessoaAutistaService;
    }

    @PostMapping
    public ResponseEntity<PessoaAutistaResponseDTO> criar(
            @RequestParam Long usuarioId,
            @RequestBody PessoaAutistaRequestDTO request
    ) {

        PessoaAutistaResponseDTO resposta =
                pessoaAutistaService.criar(
                        usuarioId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }

    @GetMapping("/{pessoaAutistaId}")
    public ResponseEntity<PessoaAutistaResponseDTO> buscar(
            @PathVariable Long pessoaAutistaId,
            @RequestParam Long usuarioId
    ) {

        PessoaAutistaResponseDTO resposta =
                pessoaAutistaService.buscar(
                        pessoaAutistaId,
                        usuarioId
                );

        return ResponseEntity.ok(
                resposta
        );
    }

    @PutMapping("/{pessoaAutistaId}")
    public ResponseEntity<PessoaAutistaResponseDTO> atualizar(
            @PathVariable Long pessoaAutistaId,
            @RequestParam Long usuarioId,
            @RequestBody PessoaAutistaRequestDTO request
    ) {

        PessoaAutistaResponseDTO resposta =
                pessoaAutistaService.atualizar(
                        pessoaAutistaId,
                        usuarioId,
                        request
                );

        return ResponseEntity.ok(
                resposta
        );
    }
}
