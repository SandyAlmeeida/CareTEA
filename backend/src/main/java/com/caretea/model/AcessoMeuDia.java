package com.caretea.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "acessos_meu_dia",
        indexes = {
                @Index(
                        name = "idx_acesso_meu_dia_pessoa",
                        columnList = "pessoa_autista_id"
                ),
                @Index(
                        name = "idx_acesso_meu_dia_codigo_hash",
                        columnList = "codigo_hash"
                ),
                @Index(
                        name = "idx_acesso_meu_dia_token_hash",
                        columnList = "token_hash"
                )
        }
)
public class AcessoMeuDia {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "pessoa_autista_id",
            nullable = false
    )
    private PessoaAutista pessoaAutista;

    /*
     * O código enviado para a pessoa autista
     * NÃO será salvo diretamente.
     *
     * Exemplo:
     * código real = ABC123
     * banco = hash SHA-256 do ABC123
     */
    @Column(
            name = "codigo_hash",
            nullable = false,
            length = 64
    )
    private String codigoHash;

    /*
     * Após validar o código,
     * o backend gera uma sessão Meu Dia.
     *
     * O token dessa sessão também
     * será salvo somente como hash.
     */
    @Column(
            name = "token_hash",
            length = 64
    )
    private String tokenHash;

    @Column(
            nullable = false
    )
    private boolean ativo = true;

    @Column(
            name = "criado_em",
            nullable = false
    )
    private LocalDateTime criadoEm;

    /*
     * O código inicial terá prazo curto.
     * A pessoa usa o código apenas para
     * autorizar aquele celular.
     */
    @Column(
            name = "codigo_expira_em",
            nullable = false
    )
    private LocalDateTime codigoExpiraEm;

    /*
     * Depois do primeiro acesso,
     * esta será a validade da sessão
     * simplificada daquele celular.
     */
    @Column(
            name = "token_expira_em"
    )
    private LocalDateTime tokenExpiraEm;

    @Column(
            name = "ultimo_acesso_em"
    )
    private LocalDateTime ultimoAcessoEm;

    public AcessoMeuDia() {
    }

    @PrePersist
    public void antesDeSalvar() {

        if (criadoEm == null) {
            criadoEm =
                    LocalDateTime.now();
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

    public PessoaAutista getPessoaAutista() {
        return pessoaAutista;
    }

    public void setPessoaAutista(
            PessoaAutista pessoaAutista
    ) {
        this.pessoaAutista =
                pessoaAutista;
    }

    public String getCodigoHash() {
        return codigoHash;
    }

    public void setCodigoHash(
            String codigoHash
    ) {
        this.codigoHash =
                codigoHash;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(
            String tokenHash
    ) {
        this.tokenHash =
                tokenHash;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(
            boolean ativo
    ) {
        this.ativo = ativo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(
            LocalDateTime criadoEm
    ) {
        this.criadoEm =
                criadoEm;
    }

    public LocalDateTime getCodigoExpiraEm() {
        return codigoExpiraEm;
    }

    public void setCodigoExpiraEm(
            LocalDateTime codigoExpiraEm
    ) {
        this.codigoExpiraEm =
                codigoExpiraEm;
    }

    public LocalDateTime getTokenExpiraEm() {
        return tokenExpiraEm;
    }

    public void setTokenExpiraEm(
            LocalDateTime tokenExpiraEm
    ) {
        this.tokenExpiraEm =
                tokenExpiraEm;
    }

    public LocalDateTime getUltimoAcessoEm() {
        return ultimoAcessoEm;
    }

    public void setUltimoAcessoEm(
            LocalDateTime ultimoAcessoEm
    ) {
        this.ultimoAcessoEm =
                ultimoAcessoEm;
    }
}