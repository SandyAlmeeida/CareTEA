package com.caretea.dto;

import com.caretea.model.EnvioWhatsapp;
import com.caretea.model.StatusEnvioWhatsapp;
import com.caretea.model.TipoNotificacao;

import java.time.LocalDateTime;

public class EnvioWhatsappResponseDTO {

    private Long id;
    private Long lembreteId;
    private String destinatario;
    private TipoNotificacao tipo;
    private StatusEnvioWhatsapp status;
    private String metaMessageId;
    private LocalDateTime dataTentativa;
    private String mensagemErro;

    public EnvioWhatsappResponseDTO() {
    }

    public EnvioWhatsappResponseDTO(
            EnvioWhatsapp envio
    ) {

        this.id =
                envio.getId();

        if (envio.getLembrete() != null) {

            this.lembreteId =
                    envio.getLembrete().getId();
        }

        this.destinatario =
                envio.getDestinatario();

        this.tipo =
                envio.getTipo();

        this.status =
                envio.getStatus();

        this.metaMessageId =
                envio.getMetaMessageId();

        this.dataTentativa =
                envio.getDataTentativa();

        this.mensagemErro =
                envio.getMensagemErro();
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public Long getLembreteId() {
        return lembreteId;
    }

    public void setLembreteId(
            Long lembreteId
    ) {
        this.lembreteId = lembreteId;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(
            String destinatario
    ) {
        this.destinatario = destinatario;
    }

    public TipoNotificacao getTipo() {
        return tipo;
    }

    public void setTipo(
            TipoNotificacao tipo
    ) {
        this.tipo = tipo;
    }

    public StatusEnvioWhatsapp getStatus() {
        return status;
    }

    public void setStatus(
            StatusEnvioWhatsapp status
    ) {
        this.status = status;
    }

    public String getMetaMessageId() {
        return metaMessageId;
    }

    public void setMetaMessageId(
            String metaMessageId
    ) {
        this.metaMessageId = metaMessageId;
    }

    public LocalDateTime getDataTentativa() {
        return dataTentativa;
    }

    public void setDataTentativa(
            LocalDateTime dataTentativa
    ) {
        this.dataTentativa = dataTentativa;
    }

    public String getMensagemErro() {
        return mensagemErro;
    }

    public void setMensagemErro(
            String mensagemErro
    ) {
        this.mensagemErro = mensagemErro;
    }
}