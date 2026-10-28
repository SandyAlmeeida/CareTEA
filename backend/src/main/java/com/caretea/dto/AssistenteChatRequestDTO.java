package com.caretea.dto;

public class AssistenteChatRequestDTO {

    private String texto;

    public AssistenteChatRequestDTO() {
    }

    public AssistenteChatRequestDTO(String texto) {
        this.texto = texto;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }
}