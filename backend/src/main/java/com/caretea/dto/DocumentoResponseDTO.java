package com.caretea.dto;

import com.caretea.model.TipoDocumento;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DocumentoResponseDTO {

    private Long id;
    private Long pessoaAutistaId;
    private String nome;
    private TipoDocumento tipo;
    private String descricao;
    private LocalDate dataDocumento;
    private String nomeArquivo;
    private String tipoMime;
    private Long tamanhoArquivo;
    private LocalDateTime criadoEm;

    public DocumentoResponseDTO() {
    }

    public DocumentoResponseDTO(
            Long id,
            Long pessoaAutistaId,
            String nome,
            TipoDocumento tipo,
            String descricao,
            LocalDate dataDocumento,
            String nomeArquivo,
            String tipoMime,
            Long tamanhoArquivo,
            LocalDateTime criadoEm
    ) {
        this.id = id;
        this.pessoaAutistaId = pessoaAutistaId;
        this.nome = nome;
        this.tipo = tipo;
        this.descricao = descricao;
        this.dataDocumento = dataDocumento;
        this.nomeArquivo = nomeArquivo;
        this.tipoMime = tipoMime;
        this.tamanhoArquivo = tamanhoArquivo;
        this.criadoEm = criadoEm;
    }

    public Long getId() {
        return id;
    }

    public Long getPessoaAutistaId() {
        return pessoaAutistaId;
    }

    public String getNome() {
        return nome;
    }

    public TipoDocumento getTipo() {
        return tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public LocalDate getDataDocumento() {
        return dataDocumento;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public String getTipoMime() {
        return tipoMime;
    }

    public Long getTamanhoArquivo() {
        return tamanhoArquivo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}