
package com.caretea.dto;

public class CadastroUsuarioDTO {

    private String nome;
    private String email;
    private String whatsapp;
    private String senha;
    private String tipoUsuario;

    private Integer nivelAutismo;
    private String nomePessoaAutista;

    private String vinculoResponsavel;
    private String whatsappResponsavel;
    private boolean enviarNotificacoesResponsavel;

    public CadastroUsuarioDTO() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public Integer getNivelAutismo() {
        return nivelAutismo;
    }

    public void setNivelAutismo(Integer nivelAutismo) {
        this.nivelAutismo = nivelAutismo;
    }

    public String getNomePessoaAutista() {
        return nomePessoaAutista;
    }

    public void setNomePessoaAutista(String nomePessoaAutista) {
        this.nomePessoaAutista = nomePessoaAutista;
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

    public void setEnviarNotificacoesResponsavel(
            boolean enviarNotificacoesResponsavel
    ) {
        this.enviarNotificacoesResponsavel =
                enviarNotificacoesResponsavel;
    }
}