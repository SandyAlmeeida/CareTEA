package com.caretea.dto;

import com.caretea.model.Notificacao;
import com.caretea.model.TipoNotificacao;

import java.time.LocalDateTime;

public class NotificacaoResponseDTO {

    private Long id;
    private Long pedidoAjudaId;
    private TipoNotificacao tipo;
    private String titulo;
    private String mensagem;
    private boolean lida;
    private LocalDateTime criadaEm;
    private LocalDateTime lidaEm;

    public NotificacaoResponseDTO() {
    }

    public NotificacaoResponseDTO(Notificacao notificacao) {
        this.id = notificacao.getId();
        this.pedidoAjudaId = notificacao.getPedidoAjudaMeuDia() == null
                ? null
                : notificacao.getPedidoAjudaMeuDia().getId();
        this.tipo = notificacao.getTipo();
        this.titulo = notificacao.getTitulo();
        this.mensagem = notificacao.getMensagem();
        this.lida = notificacao.isLida();
        this.criadaEm = notificacao.getCriadaEm();
        this.lidaEm = notificacao.getLidaEm();
    }

    public Long getId() {
        return id;
    }

    public Long getPedidoAjudaId() {
        return pedidoAjudaId;
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

    public boolean isLida() {
        return lida;
    }

    public LocalDateTime getCriadaEm() {
        return criadaEm;
    }

    public LocalDateTime getLidaEm() {
        return lidaEm;
    }
}
