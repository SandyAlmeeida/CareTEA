package com.caretea.dto;

import com.caretea.model.Humor;
import com.caretea.model.RegistroBemEstar;

import java.time.LocalDateTime;

public class RegistroBemEstarResponseDTO {

    private Long id;
    private Long usuarioId;
    private Humor humor;
    private Integer ansiedade;
    private Integer energia;
    private Integer qualidadeSono;
    private Double horasSono;
    private Integer sobrecargaSensorial;
    private String observacao;
    private LocalDateTime registradoEm;

    public RegistroBemEstarResponseDTO() {
    }

    public RegistroBemEstarResponseDTO(
            RegistroBemEstar registro
    ) {

        this.id =
                registro.getId();

        if (registro.getUsuario() != null) {
            this.usuarioId =
                    registro.getUsuario().getId();
        }

        this.humor =
                registro.getHumor();

        this.ansiedade =
                registro.getAnsiedade();

        this.energia =
                registro.getEnergia();

        this.qualidadeSono =
                registro.getQualidadeSono();

        this.horasSono =
                registro.getHorasSono();

        this.sobrecargaSensorial =
                registro.getSobrecargaSensorial();

        this.observacao =
                registro.getObservacao();

        this.registradoEm =
                registro.getRegistradoEm();
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(
            Long usuarioId
    ) {
        this.usuarioId = usuarioId;
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