package com.caretea.dto;

public class AssistenteChatResponseDTO {

    private String resposta;

    public AssistenteChatResponseDTO() {
    }

    public AssistenteChatResponseDTO(String resposta) {
        this.resposta = resposta;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        this.resposta = resposta;
    }
}