package com.caretea.dto;

public record PessoaAutistaRequestDTO(

        String nome,

        Integer nivelAutismo,

        String vinculoResponsavel,

        String whatsappResponsavel,

        Boolean enviarNotificacoesResponsavel

) {
}