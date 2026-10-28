package com.caretea.model;

import jakarta.persistence.*;

@Entity
@Table(name = "preferencias_notificacao")
public class PreferenciaNotificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "whatsapp_ativo", nullable = false)
    private boolean whatsappAtivo = true;

    @Column(name = "medicamento_ativo", nullable = false)
    private boolean medicamentoAtivo = true;

    @Column(name = "consulta_ativo", nullable = false)
    private boolean consultaAtivo = true;

    @Column(name = "exame_ativo", nullable = false)
    private boolean exameAtivo = true;

    @Column(name = "lembrete_ativo", nullable = false)
    private boolean lembreteAtivo = true;

    @Column(name = "enviar_para_responsavel", nullable = false)
    private boolean enviarParaResponsavel = true;

    @Column(name = "enviar_para_autista", nullable = false)
    private boolean enviarParaAutista = false;

    public PreferenciaNotificacao() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public boolean isWhatsappAtivo() {
        return whatsappAtivo;
    }

    public void setWhatsappAtivo(boolean whatsappAtivo) {
        this.whatsappAtivo = whatsappAtivo;
    }

    public boolean isMedicamentoAtivo() {
        return medicamentoAtivo;
    }

    public void setMedicamentoAtivo(boolean medicamentoAtivo) {
        this.medicamentoAtivo = medicamentoAtivo;
    }

    public boolean isConsultaAtivo() {
        return consultaAtivo;
    }

    public void setConsultaAtivo(boolean consultaAtivo) {
        this.consultaAtivo = consultaAtivo;
    }

    public boolean isExameAtivo() {
        return exameAtivo;
    }

    public void setExameAtivo(boolean exameAtivo) {
        this.exameAtivo = exameAtivo;
    }

    public boolean isLembreteAtivo() {
        return lembreteAtivo;
    }

    public void setLembreteAtivo(boolean lembreteAtivo) {
        this.lembreteAtivo = lembreteAtivo;
    }

    public boolean isEnviarParaResponsavel() {
        return enviarParaResponsavel;
    }

    public void setEnviarParaResponsavel(boolean enviarParaResponsavel) {
        this.enviarParaResponsavel = enviarParaResponsavel;
    }

    public boolean isEnviarParaAutista() {
        return enviarParaAutista;
    }

    public void setEnviarParaAutista(boolean enviarParaAutista) {
        this.enviarParaAutista = enviarParaAutista;
    }
}