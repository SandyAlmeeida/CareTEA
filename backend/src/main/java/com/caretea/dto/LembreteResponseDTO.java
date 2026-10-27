package com.caretea.dto;

import com.caretea.model.Lembrete;
import com.caretea.model.TipoNotificacao;

import java.time.LocalDateTime;

public class LembreteResponseDTO {

    private Long id;
    private Long usuarioId;
    private TipoNotificacao tipo;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataHora;
    private boolean ativo;
    private boolean enviado;

    private String nomeReferencia;
    private String detalheReferencia;

    public LembreteResponseDTO() {
    }

    public LembreteResponseDTO(Lembrete lembrete) {
        this.id = lembrete.getId();
        this.usuarioId = lembrete.getUsuario().getId();
        this.tipo = lembrete.getTipo();
        this.titulo = lembrete.getTitulo();
        this.mensagem = lembrete.getMensagem();
        this.dataHora = lembrete.getDataHora();
        this.ativo = lembrete.isAtivo();
        this.enviado = lembrete.isEnviado();

        this.nomeReferencia = lembrete.getNomeReferencia();
        this.detalheReferencia = lembrete.getDetalheReferencia();
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public TipoNotificacao getTipo() {
        return tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public boolean isEnviado() {
        return enviado;
    }

    public String getNomeReferencia() {
        return nomeReferencia;
    }

    public String getDetalheReferencia() {
        return detalheReferencia;
    }
}