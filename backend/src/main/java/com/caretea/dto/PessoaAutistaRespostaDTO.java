
package com.caretea.dto;

import com.caretea.model.PessoaAutista;

public record PessoaAutistaRespostaDTO(
        Long id,
        String nome,
        Integer nivelAutismo,
        String vinculoResponsavel,
        String whatsappResponsavel,
        boolean enviarNotificacoesResponsavel,
        Long usuarioId
) {

    public static PessoaAutistaRespostaDTO de(PessoaAutista pessoa) {
        return new PessoaAutistaRespostaDTO(
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getNivelAutismo(),
                pessoa.getVinculoResponsavel(),
                pessoa.getWhatsappResponsavel(),
                pessoa.isEnviarNotificacoesResponsavel(),
                pessoa.getUsuario().getId()
        );
    }
}