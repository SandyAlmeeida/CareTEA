package com.caretea.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Tipos de compromisso da agenda.
 *
 * Os valores em JSON são gravados/lidos em minúsculo (ex.: "consulta"),
 * mantendo alinhamento com as chaves de TIPOS usadas no front (Agenda.jsx).
 */
public enum TipoCompromisso {

    CONSULTA,
    TERAPIA,
    EXAME,
    COMPROMISSO,
    RETORNO,
    RECEITA;

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

    @JsonCreator
    public static TipoCompromisso fromJson(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Tipo de compromisso é obrigatório.");
        }

        try {
            return TipoCompromisso.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo de compromisso inválido: " + valor);
        }
    }
}
