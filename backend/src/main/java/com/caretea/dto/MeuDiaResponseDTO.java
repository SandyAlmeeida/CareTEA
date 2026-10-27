package com.caretea.dto;

import java.time.LocalDate;
import java.util.List;

public record MeuDiaResponseDTO(

        Long pessoaAutistaId,

        String nomePessoaAutista,

        Integer nivelAutismo,

        LocalDate data,

        String humorHoje,

        List<MeuDiaMedicamentoDTO> medicamentos,

        List<MeuDiaCompromissoDTO> compromissos

) {
}