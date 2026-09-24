package com.caretea.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pessoas_autistas")
public class PessoaAutista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Integer nivelAutismo;

    private String vinculoResponsavel;

    private String whatsappResponsavel;

    private boolean enviarNotificacoesResponsavel;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public PessoaAutista() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}