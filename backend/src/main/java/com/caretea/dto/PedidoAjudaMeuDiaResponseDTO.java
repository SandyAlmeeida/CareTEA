package com.caretea.dto;

import java.time.LocalDateTime;

public record PedidoAjudaMeuDiaResponseDTO(
        Long id,
        Long pessoaAutistaId,
        String nomePessoaAutista,
        LocalDateTime solicitadoEm,
        boolean atendido
) {
}