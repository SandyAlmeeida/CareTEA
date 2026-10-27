package com.caretea.dto;

import com.caretea.model.Humor;

import java.time.LocalDateTime;

public class DashboardBemEstarResponseDTO {

    private Long usuarioId;

    private LocalDateTime inicio;
    private LocalDateTime fim;

    private Long totalRegistros;

    /*
     * Humor será convertido para uma escala:
     *
     * MUITO_MAL  = 1
     * MAL        = 2
     * NEUTRO     = 3
     * BEM        = 4
     * MUITO_BEM  = 5
     */
    private Double mediaHumor;

    private Humor humorPredominante;

    private Double mediaAnsiedade;
    private Double mediaEnergia;
    private Double mediaQualidadeSono;
    private Double mediaHorasSono;
    private Double mediaSobrecargaSensorial;

    public DashboardBemEstarResponseDTO() {
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(
            Long usuarioId
    ) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public void setInicio(
            LocalDateTime inicio
    ) {
        this.inicio = inicio;
    }

    public LocalDateTime getFim() {
        return fim;
    }

    public void setFim(
            LocalDateTime fim
    ) {
        this.fim = fim;
    }

    public Long getTotalRegistros() {
        return totalRegistros;
    }

    public void setTotalRegistros(
            Long totalRegistros
    ) {
        this.totalRegistros = totalRegistros;
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
        this.mediaEnergia = mediaEnergia;
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
}