package com.caretea.dto;

public class LoginResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String whatsapp;
    private String tipoUsuario;

    public LoginResponseDTO(Long id, String nome, String email, String whatsapp, String tipoUsuario) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.whatsapp = whatsapp;
        this.tipoUsuario = tipoUsuario;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }
}