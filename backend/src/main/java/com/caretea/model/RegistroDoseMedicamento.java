package com.caretea.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "registros_dose_medicamento",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_registro_dose_medicamento_dia",
                        columnNames = {
                                "medicamento_id",
                                "data_dose"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_registro_dose_pessoa_data",
                        columnList = "pessoa_autista_id,data_dose"
                ),
                @Index(
                        name = "idx_registro_dose_medicamento",
                        columnList = "medicamento_id"
                )
        }
)
public class RegistroDoseMedicamento {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            name = "medicamento_id",
            nullable = false
    )
    private Long medicamentoId;

    @Column(
            name = "pessoa_autista_id",
            nullable = false
    )
    private Long pessoaAutistaId;

    /*
     * Dia ao qual aquela dose pertence.
     *
     * Exemplo:
     * medicamento das 20:00 do dia 21/10.
     */
    @Column(
            name = "data_dose",
            nullable = false
    )
    private LocalDate dataDose;

    /*
     * Momento real em que a pessoa
     * confirmou "Já tomei".
     */
    @Column(
            name = "confirmado_em",
            nullable = false
    )
    private LocalDateTime confirmadoEm;

    /*
     * Permite saber de onde a confirmação veio.
     *
     * Por enquanto teremos principalmente:
     * MEU_DIA
     * PAINEL
     */
    @Column(
            name = "origem",
            nullable = false,
            length = 30
    )
    private String origem;

    public RegistroDoseMedicamento() {
    }

    @PrePersist
    public void antesDeSalvar() {

        if (dataDose == null) {
            dataDose =
                    LocalDate.now();
        }

        if (confirmadoEm == null) {
            confirmadoEm =
                    LocalDateTime.now();
        }

        if (
                origem == null ||
                        origem.isBlank()
        ) {
            origem =
                    "MEU_DIA";
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

    public Long getMedicamentoId() {
        return medicamentoId;
    }

    public void setMedicamentoId(
            Long medicamentoId
    ) {
        this.medicamentoId =
                medicamentoId;
    }

    public Long getPessoaAutistaId() {
        return pessoaAutistaId;
    }

    public void setPessoaAutistaId(
            Long pessoaAutistaId
    ) {
        this.pessoaAutistaId =
                pessoaAutistaId;
    }

    public LocalDate getDataDose() {
        return dataDose;
    }

    public void setDataDose(
            LocalDate dataDose
    ) {
        this.dataDose =
                dataDose;
    }

    public LocalDateTime getConfirmadoEm() {
        return confirmadoEm;
    }

    public void setConfirmadoEm(
            LocalDateTime confirmadoEm
    ) {
        this.confirmadoEm =
                confirmadoEm;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(
            String origem
    ) {
        this.origem =
                origem;
    }
}