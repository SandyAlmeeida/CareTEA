package com.caretea.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registros_bem_estar")
public class RegistroBemEstar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "usuario_id",
            nullable = false
    )
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Humor humor;

    @Column(nullable = false)
    private Integer ansiedade;

    @Column(nullable = false)
    private Integer energia;

    @Column(name = "qualidade_sono", nullable = false)
    private Integer qualidadeSono;

    @Column(name = "horas_sono")
    private Double horasSono;

    @Column(name = "sobrecarga_sensorial", nullable = false)
    private Integer sobrecargaSensorial;

    @Column(length = 2000)
    private String observacao;

    @Column(name = "registrado_em", nullable = false)
    private LocalDateTime registradoEm;

    public RegistroBemEstar() {
    }

    @PrePersist
    public void prePersist() {

        if (registradoEm == null) {
            registradoEm = LocalDateTime.now();
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(
            Usuario usuario
    ) {
        this.usuario = usuario;
    }

    public Humor getHumor() {
        return humor;
    }

    public void setHumor(
            Humor humor
    ) {
        this.humor = humor;
    }

    public Integer getAnsiedade() {
        return ansiedade;
    }

    public void setAnsiedade(
            Integer ansiedade
    ) {
        this.ansiedade = ansiedade;
    }

    public Integer getEnergia() {
        return energia;
    }

    public void setEnergia(
            Integer energia
    ) {
        this.energia = energia;
    }

    public Integer getQualidadeSono() {
        return qualidadeSono;
    }

    public void setQualidadeSono(
            Integer qualidadeSono
    ) {
        this.qualidadeSono = qualidadeSono;
    }

    public Double getHorasSono() {
        return horasSono;
    }

    public void setHorasSono(
            Double horasSono
    ) {
        this.horasSono = horasSono;
    }

    public Integer getSobrecargaSensorial() {
        return sobrecargaSensorial;
    }

    public void setSobrecargaSensorial(
            Integer sobrecargaSensorial
    ) {
        this.sobrecargaSensorial =
                sobrecargaSensorial;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(
            String observacao
    ) {
        this.observacao = observacao;
    }

    public LocalDateTime getRegistradoEm() {
        return registradoEm;
    }

    public void setRegistradoEm(
            LocalDateTime registradoEm
    ) {
        this.registradoEm = registradoEm;
    }
}