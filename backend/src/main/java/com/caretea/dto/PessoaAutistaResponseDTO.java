package com.caretea.dto;

public record PessoaAutistaResponseDTO(

        Long id,

        String nome,

        Integer nivelAutismo,

        String vinculoResponsavel,

        String whatsappResponsavel,

        boolean enviarNotificacoesResponsavel,

        Long usuarioId

) {
}