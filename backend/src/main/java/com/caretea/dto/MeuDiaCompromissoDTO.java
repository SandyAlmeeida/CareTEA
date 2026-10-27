package com.caretea.dto;

import java.time.LocalDateTime;

public record MeuDiaCompromissoDTO(

        Long id,

        String tipo,

        String titulo,

        String detalhe,

        LocalDateTime dataHora

) {
}