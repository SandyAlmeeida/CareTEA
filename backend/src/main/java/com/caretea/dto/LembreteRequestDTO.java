package com.caretea.dto;

import com.caretea.model.TipoNotificacao;

import java.time.LocalDateTime;

public class LembreteRequestDTO {

    private Long usuarioId;
    private TipoNotificacao tipo;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataHora;

    private String nomeReferencia;
    private String detalheReferencia;

    public LembreteRequestDTO() {
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

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getNomeReferencia() {
        return nomeReferencia;
    }

    public void setNomeReferencia(String nomeReferencia) {
        this.nomeReferencia = nomeReferencia;
    }

    public String getDetalheReferencia() {
        return detalheReferencia;
    }

    public void setDetalheReferencia(String detalheReferencia) {
        this.detalheReferencia = detalheReferencia;
    }
}