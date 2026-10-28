package com.caretea.dto;

import com.caretea.model.TipoNotificacao;

import java.time.LocalDateTime;

public class AvisoCompromissoRequestDTO {

    private Long usuarioId;
    private TipoNotificacao tipo;
    private String descricao;
    private LocalDateTime dataHora;

    public AvisoCompromissoRequestDTO() {
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public TipoNotificacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoNotificacao tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}