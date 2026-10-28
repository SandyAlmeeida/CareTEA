package com.caretea.dto;

import java.time.LocalDateTime;

public record AcessoMeuDiaResponseDTO(

        Long id,

        Long pessoaAutistaId,

        String nomePessoaAutista,

        Integer nivelAutismo,

        boolean ativo,

        LocalDateTime criadoEm,

        LocalDateTime codigoExpiraEm,

        LocalDateTime tokenExpiraEm,

        LocalDateTime ultimoAcessoEm,

        /*
         * Só será preenchido quando
         * um NOVO acesso for criado.
         *
         * Depois não conseguimos recuperar
         * o código original porque o banco
         * guarda apenas o hash.
         */
        String codigo

) {
}