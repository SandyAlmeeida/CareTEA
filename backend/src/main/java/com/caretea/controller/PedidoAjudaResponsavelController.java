package com.caretea.controller;

import com.caretea.dto.PedidoAjudaMeuDiaResponseDTO;
import com.caretea.service.PedidoAjudaMeuDiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/responsavel/meu-dia/ajuda")
public class PedidoAjudaResponsavelController {

    private final PedidoAjudaMeuDiaService pedidoAjudaMeuDiaService;

    public PedidoAjudaResponsavelController(
            PedidoAjudaMeuDiaService pedidoAjudaMeuDiaService
    ) {
        this.pedidoAjudaMeuDiaService =
                pedidoAjudaMeuDiaService;
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<PedidoAjudaMeuDiaResponseDTO>> listarPendentes(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long pessoaAutistaId
    ) {

        Long usuarioId =
                Long.valueOf(
                        jwt.getSubject()
                );

        List<PedidoAjudaMeuDiaResponseDTO> pedidos =
                pedidoAjudaMeuDiaService
                        .listarPendentesDoResponsavel(
                                usuarioId,
                                pessoaAutistaId
                        );

        return ResponseEntity.ok(
                pedidos
        );
    }

    @PatchMapping("/{pedidoId}/atendido")
    public ResponseEntity<Void> marcarComoAtendido(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long pedidoId
    ) {

        Long usuarioId =
                Long.valueOf(
                        jwt.getSubject()
                );

        pedidoAjudaMeuDiaService
                .marcarComoAtendido(
                        usuarioId,
                        pedidoId
                );

        return ResponseEntity.noContent()
                .build();
    }
}