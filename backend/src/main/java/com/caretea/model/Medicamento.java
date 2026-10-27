package com.caretea.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

@Entity
@Table(name = "medicamentos")
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do medicamento é obrigatório.")
    @Column(nullable = false)
    private String nome;

    @NotNull(message = "Horário é obrigatório.")
    @Column(nullable = false)
    private LocalTime horario;

    @NotBlank(message = "Dose é obrigatória.")
    @Column(nullable = false)
    private String dose;

    @Column(length = 1000)
    private String observacoes;

    @NotNull(message = "Tempo do lembrete é obrigatório.")
    @Min(value = 1, message = "O lembrete deve ser maior que zero.")
    @Column(nullable = false)
    private Integer lembreteMinutos = 15;

    @NotNull(message = "Tempo para avisar o responsável é obrigatório.")
    @Min(value = 1, message = "O tempo para avisar o responsável deve ser maior que zero.")
    @Column(nullable = false)
    private Integer responsavelMinutos = 30;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }
    public String getDose() { return dose; }
    public void setDose(String dose) { this.dose = dose; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public Integer getLembreteMinutos() { return lembreteMinutos; }
    public void setLembreteMinutos(Integer lembreteMinutos) { this.lembreteMinutos = lembreteMinutos; }
    public Integer getResponsavelMinutos() { return responsavelMinutos; }
    public void setResponsavelMinutos(Integer responsavelMinutos) { this.responsavelMinutos = responsavelMinutos; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
