package com.caretea.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "envios_whatsapp")
public class EnvioWhatsapp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lembrete_id")
    private Lembrete lembrete;

    @ManyToOne
    @JoinColumn(name = "pedido_ajuda_meu_dia_id")
    private PedidoAjudaMeuDia pedidoAjudaMeuDia;

    @Column(nullable = false)
    private String destinatario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoNotificacao tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEnvioWhatsapp status;

    @Column(name = "meta_message_id", unique = true)
    private String metaMessageId;

    @Column(name = "data_tentativa", nullable = false)
    private LocalDateTime dataTentativa;

    @Column(name = "mensagem_erro", length = 2000)
    private String mensagemErro;

    public EnvioWhatsapp() {
    }

    @PrePersist
    public void prePersist() {

        if (dataTentativa == null) {
            dataTentativa = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Lembrete getLembrete() {
        return lembrete;
    }

    public void setLembrete(Lembrete lembrete) {
        this.lembrete = lembrete;
    }

    public PedidoAjudaMeuDia getPedidoAjudaMeuDia() {
        return pedidoAjudaMeuDia;
    }

    public void setPedidoAjudaMeuDia(PedidoAjudaMeuDia pedidoAjudaMeuDia) {
        this.pedidoAjudaMeuDia = pedidoAjudaMeuDia;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }

    public TipoNotificacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoNotificacao tipo) {
        this.tipo = tipo;
    }

    public StatusEnvioWhatsapp getStatus() {
        return status;
    }

    public void setStatus(StatusEnvioWhatsapp status) {
        this.status = status;
    }

    public String getMetaMessageId() {
        return metaMessageId;
    }

    public void setMetaMessageId(String metaMessageId) {
        this.metaMessageId = metaMessageId;
    }

    public LocalDateTime getDataTentativa() {
        return dataTentativa;
    }

    public void setDataTentativa(LocalDateTime dataTentativa) {
        this.dataTentativa = dataTentativa;
    }

    public String getMensagemErro() {
        return mensagemErro;
    }

    public void setMensagemErro(String mensagemErro) {
        this.mensagemErro = mensagemErro;
    }
}
