package com.caretea.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AnaliseBemEstarIAResponseDTO {

    private Long usuarioId;

    private String resumo;

    private String tendenciaHumor;
    private String tendenciaAnsiedade;
    private String tendenciaEnergia;
    private String tendenciaSono;
    private String tendenciaSobrecargaSensorial;

    private List<String> pontosPositivos;
    private List<String> pontosAtencao;
    private List<String> recomendacoes;

    private String observacaoSeguranca;

    private LocalDateTime geradoEm;

    public AnaliseBemEstarIAResponseDTO() {
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(
            Long usuarioId
    ) {
        this.usuarioId = usuarioId;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(
            String resumo
    ) {
        this.resumo = resumo;
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

    public List<String> getPontosPositivos() {
        return pontosPositivos;
    }

    public void setPontosPositivos(
            List<String> pontosPositivos
    ) {
        this.pontosPositivos =
                pontosPositivos;
    }

    public List<String> getPontosAtencao() {
        return pontosAtencao;
    }

    public void setPontosAtencao(
            List<String> pontosAtencao
    ) {
        this.pontosAtencao =
                pontosAtencao;
    }

    public List<String> getRecomendacoes() {
        return recomendacoes;
    }

    public void setRecomendacoes(
            List<String> recomendacoes
    ) {
        this.recomendacoes =
                recomendacoes;
    }

    public String getObservacaoSeguranca() {
        return observacaoSeguranca;
    }

    public void setObservacaoSeguranca(
            String observacaoSeguranca
    ) {
        this.observacaoSeguranca =
                observacaoSeguranca;
    }

    public LocalDateTime getGeradoEm() {
        return geradoEm;
    }

    public void setGeradoEm(
            LocalDateTime geradoEm
    ) {
        this.geradoEm = geradoEm;
    }
}