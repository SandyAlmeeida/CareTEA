package com.caretea.dto;

import com.caretea.model.Humor;

import java.time.LocalDateTime;
import java.util.List;

public class ContextoBemEstarIADTO {

    private LocalDateTime inicio;
    private LocalDateTime fim;

    private Long totalRegistros;

    private Double mediaHumor;
    private Humor humorPredominante;

    private Double mediaAnsiedade;
    private Double mediaEnergia;
    private Double mediaQualidadeSono;
    private Double mediaHorasSono;
    private Double mediaSobrecargaSensorial;

    private String tendenciaHumor;
    private String tendenciaAnsiedade;
    private String tendenciaEnergia;
    private String tendenciaSono;
    private String tendenciaSobrecargaSensorial;

    private List<EvolucaoBemEstarDTO> evolucao;

    public ContextoBemEstarIADTO() {
    }

    public ContextoBemEstarIADTO(
            DashboardBemEstarResponseDTO resumo,
            List<EvolucaoBemEstarDTO> evolucao,
            AnaliseBemEstarIAResponseDTO analiseBase
    ) {

        this.inicio =
                resumo.getInicio();

        this.fim =
                resumo.getFim();

        this.totalRegistros =
                resumo.getTotalRegistros();

        this.mediaHumor =
                resumo.getMediaHumor();

        this.humorPredominante =
                resumo.getHumorPredominante();

        this.mediaAnsiedade =
                resumo.getMediaAnsiedade();

        this.mediaEnergia =
                resumo.getMediaEnergia();

        this.mediaQualidadeSono =
                resumo.getMediaQualidadeSono();

        this.mediaHorasSono =
                resumo.getMediaHorasSono();

        this.mediaSobrecargaSensorial =
                resumo.getMediaSobrecargaSensorial();

        this.tendenciaHumor =
                analiseBase.getTendenciaHumor();

        this.tendenciaAnsiedade =
                analiseBase.getTendenciaAnsiedade();

        this.tendenciaEnergia =
                analiseBase.getTendenciaEnergia();

        this.tendenciaSono =
                analiseBase.getTendenciaSono();

        this.tendenciaSobrecargaSensorial =
                analiseBase
                        .getTendenciaSobrecargaSensorial();

        this.evolucao =
                evolucao;
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
        this.totalRegistros =
                totalRegistros;
    }

    public Double getMediaHumor() {
        return mediaHumor;
    }

    public void setMediaHumor(
            Double mediaHumor
    ) {
        this.mediaHumor =
                mediaHumor;
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

    public String getTendenciaHumor() {
        return tendenciaHumor;
    }

    public void setTendenciaHumor(
            String tendenciaHumor
    ) {
        this.tendenciaHumor =
                tendenciaHumor;
    }

    public String getTendenciaAnsiedade() {
        return tendenciaAnsiedade;
    }

    public void setTendenciaAnsiedade(
            String tendenciaAnsiedade
    ) {
        this.tendenciaAnsiedade =
                tendenciaAnsiedade;
    }

    public String getTendenciaEnergia() {
        return tendenciaEnergia;
    }

    public void setTendenciaEnergia(
            String tendenciaEnergia
    ) {
        this.tendenciaEnergia =
                tendenciaEnergia;
    }

    public String getTendenciaSono() {
        return tendenciaSono;
    }

    public void setTendenciaSono(
            String tendenciaSono
    ) {
        this.tendenciaSono =
                tendenciaSono;
    }

    public String getTendenciaSobrecargaSensorial() {
        return tendenciaSobrecargaSensorial;
    }

    public void setTendenciaSobrecargaSensorial(
            String tendenciaSobrecargaSensorial
    ) {
        this.tendenciaSobrecargaSensorial =
                tendenciaSobrecargaSensorial;
    }

    public List<EvolucaoBemEstarDTO> getEvolucao() {
        return evolucao;
    }

    public void setEvolucao(
            List<EvolucaoBemEstarDTO> evolucao
    ) {
        this.evolucao =
                evolucao;
    }
}