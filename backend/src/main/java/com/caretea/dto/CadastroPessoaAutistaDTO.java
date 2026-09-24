package com.caretea.dto;

public class CadastroPessoaAutistaDTO {

    private String nome;
    private Integer nivelAutismo;
    private String vinculoResponsavel;
    private String whatsappResponsavel;
    private boolean enviarNotificacoesResponsavel;
    private Long usuarioId;

    public CadastroPessoaAutistaDTO() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getNivelAutismo() {
        return nivelAutismo;
    }

    public void setNivelAutismo(Integer nivelAutismo) {
        this.nivelAutismo = nivelAutismo;
    }

    public String getVinculoResponsavel() {
        return vinculoResponsavel;
    }

    public void setVinculoResponsavel(String vinculoResponsavel) {
        this.vinculoResponsavel = vinculoResponsavel;
    }

    public String getWhatsappResponsavel() {
        return whatsappResponsavel;
    }

    public void setWhatsappResponsavel(String whatsappResponsavel) {
        this.whatsappResponsavel = whatsappResponsavel;
    }

    public boolean isEnviarNotificacoesResponsavel() {
        return enviarNotificacoesResponsavel;
    }

    public void setEnviarNotificacoesResponsavel(boolean enviarNotificacoesResponsavel) {
        this.enviarNotificacoesResponsavel = enviarNotificacoesResponsavel;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}