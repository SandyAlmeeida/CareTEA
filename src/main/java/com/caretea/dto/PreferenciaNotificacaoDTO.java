package com.caretea.dto;

import com.caretea.model.PreferenciaNotificacao;

public class PreferenciaNotificacaoDTO {

    private Long id;
    private boolean whatsappAtivo;
    private boolean medicamentoAtivo;
    private boolean consultaAtivo;
    private boolean exameAtivo;
    private boolean lembreteAtivo;
    private boolean enviarParaResponsavel;
    private boolean enviarParaAutista;

    public PreferenciaNotificacaoDTO() {
    }

    public PreferenciaNotificacaoDTO(PreferenciaNotificacao preferencia) {
        this.id = preferencia.getId();
        this.whatsappAtivo = preferencia.isWhatsappAtivo();
        this.medicamentoAtivo = preferencia.isMedicamentoAtivo();
        this.consultaAtivo = preferencia.isConsultaAtivo();
        this.exameAtivo = preferencia.isExameAtivo();
        this.lembreteAtivo = preferencia.isLembreteAtivo();
        this.enviarParaResponsavel = preferencia.isEnviarParaResponsavel();
        this.enviarParaAutista = preferencia.isEnviarParaAutista();
    }

    public Long getId() {
        return id;
    }

    public boolean isWhatsappAtivo() {
        return whatsappAtivo;
    }

    public boolean isMedicamentoAtivo() {
        return medicamentoAtivo;
    }

    public boolean isConsultaAtivo() {
        return consultaAtivo;
    }

    public boolean isExameAtivo() {
        return exameAtivo;
    }

    public boolean isLembreteAtivo() {
        return lembreteAtivo;
    }

    public boolean isEnviarParaResponsavel() {
        return enviarParaResponsavel;
    }

    public boolean isEnviarParaAutista() {
        return enviarParaAutista;
    }

    public void setWhatsappAtivo(boolean whatsappAtivo) {
        this.whatsappAtivo = whatsappAtivo;
    }

    public void setMedicamentoAtivo(boolean medicamentoAtivo) {
        this.medicamentoAtivo = medicamentoAtivo;
    }

    public void setConsultaAtivo(boolean consultaAtivo) {
        this.consultaAtivo = consultaAtivo;
    }

    public void setExameAtivo(boolean exameAtivo) {
        this.exameAtivo = exameAtivo;
    }

    public void setLembreteAtivo(boolean lembreteAtivo) {
        this.lembreteAtivo = lembreteAtivo;
    }

    public void setEnviarParaResponsavel(boolean enviarParaResponsavel) {
        this.enviarParaResponsavel = enviarParaResponsavel;
    }

    public void setEnviarParaAutista(boolean enviarParaAutista) {
        this.enviarParaAutista = enviarParaAutista;
    }
}