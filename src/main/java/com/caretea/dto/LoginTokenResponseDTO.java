
package com.caretea.dto;

public class LoginTokenResponseDTO {

    private String token;
    private LoginResponseDTO usuario;

    public LoginTokenResponseDTO(
            String token,
            LoginResponseDTO usuario
    ) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() {
        return token;
    }

    public LoginResponseDTO getUsuario() {
        return usuario;
    }
}