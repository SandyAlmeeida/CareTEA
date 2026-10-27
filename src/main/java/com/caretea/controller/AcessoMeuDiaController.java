package com.caretea.controller;

import com.caretea.dto.AcessoMeuDiaResponseDTO;
import com.caretea.dto.GerarAcessoMeuDiaRequestDTO;
import com.caretea.dto.LoginMeuDiaRequestDTO;
import com.caretea.dto.LoginMeuDiaResponseDTO;
import com.caretea.service.AcessoMeuDiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/acesso-meu-dia")
public class AcessoMeuDiaController {

    private final AcessoMeuDiaService acessoMeuDiaService;

    public AcessoMeuDiaController(
            AcessoMeuDiaService acessoMeuDiaService
    ) {
        this.acessoMeuDiaService =
                acessoMeuDiaService;
    }

    /*
     * Responsável gera um novo código.
     */
    @PostMapping("/gerar")
    public ResponseEntity<AcessoMeuDiaResponseDTO> gerar(
            @RequestParam Long usuarioId,
            @RequestBody GerarAcessoMeuDiaRequestDTO request
    ) {

        AcessoMeuDiaResponseDTO resposta =
                acessoMeuDiaService.gerar(
                        usuarioId,
                        request.pessoaAutistaId()
                );

        return ResponseEntity.ok(
                resposta
        );
    }

    /*
     * Responsável consulta se existe
     * um acesso ativo.
     */
    @GetMapping("/status")
    public ResponseEntity<AcessoMeuDiaResponseDTO> consultar(
            @RequestParam Long usuarioId,
            @RequestParam Long pessoaAutistaId
    ) {

        AcessoMeuDiaResponseDTO resposta =
                acessoMeuDiaService.consultar(
                        usuarioId,
                        pessoaAutistaId
                );

        return ResponseEntity.ok(
                resposta
        );
    }

    /*
     * Entrada simplificada da pessoa autista.
     *
     * Esta será uma das poucas rotas públicas.
     */
    @PostMapping("/entrar")
    public ResponseEntity<LoginMeuDiaResponseDTO> entrar(
            @RequestBody LoginMeuDiaRequestDTO request
    ) {

        LoginMeuDiaResponseDTO resposta =
                acessoMeuDiaService.entrar(
                        request.codigo()
                );

        return ResponseEntity.ok(
                resposta
        );
    }

    /*
     * Responsável revoga código + sessão.
     */
    @DeleteMapping("/revogar")
    public ResponseEntity<Void> revogar(
            @RequestParam Long usuarioId,
            @RequestParam Long pessoaAutistaId
    ) {

        acessoMeuDiaService.revogar(
                usuarioId,
                pessoaAutistaId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}