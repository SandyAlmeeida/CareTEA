package com.caretea.dto;

import com.caretea.model.Humor;

import java.time.LocalDate;

public class EvolucaoBemEstarDTO {

    private LocalDate data;

    private Double mediaHumor;
    private Humor humorPredominante;

    private Double mediaAnsiedade;
    private Double mediaEnergia;
    private Double mediaQualidadeSono;
    private Double mediaHorasSono;
    private Double mediaSobrecargaSensorial;

    private Long totalRegistros;

    public EvolucaoBemEstarDTO() {
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(
            LocalDate data
    ) {
        this.data = data;
    }

    public Double getMediaHumor() {
        return mediaHumor;
    }

    public void setMediaHumor(
            Double mediaHumor
    ) {
        this.mediaHumor = mediaHumor;
    }

    public Humor getHumorPredominante() {
        return humorPredominante;
    }

    public void setHumorPredominante(
            Humor humorPredominante
    ) {
        this.humorPredominante =
                humorPredominante;
    }

    public Double getMediaAnsiedade() {
        return mediaAnsiedade;
    }

    public void setMediaAnsiedade(
            Double mediaAnsiedade
    ) {
        this.mediaAnsiedade =
                mediaAnsiedade;
    }

    public Double getMediaEnergia() {
        return mediaEnergia;
    }

    public void setMediaEnergia(
            Double mediaEnergia
    ) {
        this.mediaEnergia =
                mediaEnergia;
    }

    public Double getMediaQualidadeSono() {
        return mediaQualidadeSono;
    }

    public void setMediaQualidadeSono(
            Double mediaQualidadeSono
    ) {
        this.mediaQualidadeSono =
                mediaQualidadeSono;
    }

    public Double getMediaHorasSono() {
        return mediaHorasSono;
    }

    public void setMediaHorasSono(
            Double mediaHorasSono
    ) {
        this.mediaHorasSono =
                mediaHorasSono;
    }

    public Double getMediaSobrecargaSensorial() {
        return mediaSobrecargaSensorial;
    }

    public void setMediaSobrecargaSensorial(
            Double mediaSobrecargaSensorial
    ) {
        this.mediaSobrecargaSensorial =
                mediaSobrecargaSensorial;
    }

    public Long getTotalRegistros() {
        return totalRegistros;
    }

    public void setTotalRegistros(
            Long totalRegistros
    ) {
        this.totalRegistros =
                totalRegistros;
    }
}