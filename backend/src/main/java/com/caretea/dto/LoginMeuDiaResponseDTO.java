package com.caretea.dto;

import java.time.LocalDateTime;

public record LoginMeuDiaResponseDTO(

        String token,

        Long pessoaAutistaId,

        String nomePessoaAutista,

        Integer nivelAutismo,

        LocalDateTime tokenExpiraEm

) {
}