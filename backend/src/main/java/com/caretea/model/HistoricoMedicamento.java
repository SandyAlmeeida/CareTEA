package com.caretea.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "historico_medicamentos",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_historico_medicamento_data",
        columnNames = {"medicamento_id", "data_referencia"}
    )
)
public class HistoricoMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "data_referencia", nullable = false)
    private LocalDate dataReferencia;

    @Column(nullable = false)
    private LocalDateTime tomadoEm;

    public HistoricoMedicamento() {}

    public HistoricoMedicamento(Medicamento medicamento, Usuario usuario,
                                LocalDate dataReferencia, LocalDateTime tomadoEm) {
        this.medicamento = medicamento;
        this.usuario = usuario;
        this.dataReferencia = dataReferencia;
        this.tomadoEm = tomadoEm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public LocalDate getDataReferencia() { return dataReferencia; }
    public void setDataReferencia(LocalDate dataReferencia) { this.dataReferencia = dataReferencia; }
    public LocalDateTime getTomadoEm() { return tomadoEm; }
    public void setTomadoEm(LocalDateTime tomadoEm) { this.tomadoEm = tomadoEm; }
}
