package com.caretea.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "pedidos_ajuda_meu_dia",
        indexes = {
                @Index(
                        name = "idx_pedido_ajuda_pessoa",
                        columnList = "pessoa_autista_id"
                ),
                @Index(
                        name = "idx_pedido_ajuda_solicitado_em",
                        columnList = "solicitado_em"
                )
        }
)
public class PedidoAjudaMeuDia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "pessoa_autista_id",
            nullable = false
    )
    private PessoaAutista pessoaAutista;

    @Column(
            name = "solicitado_em",
            nullable = false
    )
    private LocalDateTime solicitadoEm;

    @Column(nullable = false)
    private boolean atendido = false;

    @Column(name = "atendido_em")
    private LocalDateTime atendidoEm;

    public PedidoAjudaMeuDia() {
    }

    @PrePersist
    public void prePersist() {
        if (solicitadoEm == null) {
            solicitadoEm =
                    LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PessoaAutista getPessoaAutista() {
        return pessoaAutista;
    }

    public void setPessoaAutista(
            PessoaAutista pessoaAutista
    ) {
        this.pessoaAutista =
                pessoaAutista;
    }

    public LocalDateTime getSolicitadoEm() {
        return solicitadoEm;
    }

    public void setSolicitadoEm(
            LocalDateTime solicitadoEm
    ) {
        this.solicitadoEm =
                solicitadoEm;
    }

    public boolean isAtendido() {
        return atendido;
    }

    public void setAtendido(
            boolean atendido
    ) {
        this.atendido = atendido;
    }

    public LocalDateTime getAtendidoEm() {
        return atendidoEm;
    }

    public void setAtendidoEm(
            LocalDateTime atendidoEm
    ) {
        this.atendidoEm =
                atendidoEm;
    }
}