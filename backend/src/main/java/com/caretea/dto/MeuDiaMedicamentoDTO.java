package com.caretea.dto;

import java.time.LocalTime;

public record MeuDiaMedicamentoDTO(

        Long id,

        String nome,

        String dosagem,

        LocalTime horario,

        String observacoes,

        boolean tomadoHoje

) {
}