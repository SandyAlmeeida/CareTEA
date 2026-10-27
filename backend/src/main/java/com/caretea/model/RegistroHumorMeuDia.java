package com.caretea.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "registros_humor_meu_dia",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_humor_meu_dia_pessoa_data",
                        columnNames = {
                                "pessoa_autista_id",
                                "data_registro"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_humor_meu_dia_pessoa_data",
                        columnList = "pessoa_autista_id,data_registro"
                )
        }
)
public class RegistroHumorMeuDia {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
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

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private Humor humor;

    @Column(
            name = "data_registro",
            nullable = false
    )
    private LocalDate dataRegistro;

    @Column(
            name = "registrado_em",
            nullable = false
    )
    private LocalDateTime registradoEm;

    public RegistroHumorMeuDia() {
    }

    @PrePersist
    public void antesDeSalvar() {

        if (dataRegistro == null) {
            dataRegistro =
                    LocalDate.now();
        }

        if (registradoEm == null) {
            registradoEm =
                    LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
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

    public Humor getHumor() {
        return humor;
    }

    public void setHumor(
            Humor humor
    ) {
        this.humor =
                humor;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(
            LocalDate dataRegistro
    ) {
        this.dataRegistro =
                dataRegistro;
    }

    public LocalDateTime getRegistradoEm() {
        return registradoEm;
    }

    public void setRegistradoEm(
            LocalDateTime registradoEm
    ) {
        this.registradoEm =
                registradoEm;
    }
}