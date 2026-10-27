package com.caretea.service;

import com.caretea.dto.AcessoMeuDiaResponseDTO;
import com.caretea.dto.LoginMeuDiaResponseDTO;
import com.caretea.model.AcessoMeuDia;
import com.caretea.model.PessoaAutista;
import com.caretea.repository.AcessoMeuDiaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class AcessoMeuDiaService {

    /*
     * Código simples para digitação manual.
     *
     * Removemos caracteres parecidos como:
     * 0, O, 1, I
     */
    private static final String CARACTERES_CODIGO =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private static final int TAMANHO_CODIGO =
            6;

    /*
     * O código serve apenas para autorizar
     * inicialmente o celular.
     */
    private static final int HORAS_VALIDADE_CODIGO =
            24;

    /*
     * Depois de autorizado, o celular recebe
     * um token Meu Dia.
     */
    private static final int DIAS_VALIDADE_TOKEN =
            30;

    private final AcessoMeuDiaRepository acessoMeuDiaRepository;

    private final PessoaAutistaService pessoaAutistaService;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public AcessoMeuDiaService(
            AcessoMeuDiaRepository acessoMeuDiaRepository,
            PessoaAutistaService pessoaAutistaService
    ) {
        this.acessoMeuDiaRepository =
                acessoMeuDiaRepository;

        this.pessoaAutistaService =
                pessoaAutistaService;
    }

    /*
     * =====================================================
     * RESPONSÁVEL GERA UM NOVO ACESSO
     * =====================================================
     */

    @Transactional
    public AcessoMeuDiaResponseDTO gerar(
            Long usuarioId,
            Long pessoaAutistaId
    ) {

        PessoaAutista pessoa =
                pessoaAutistaService
                        .buscarEntidadeVinculada(
                                pessoaAutistaId,
                                usuarioId
                        );

        /*
         * Meu Dia é exclusivo do Nível 2.
         */
        pessoaAutistaService
                .validarAcessoMeuDia(
                        pessoa
                );

        /*
         * Revoga acessos anteriores.
         *
         * Assim existe apenas um acesso Meu Dia
         * válido de cada vez.
         */
        revogarAcessosAnteriores(
                pessoaAutistaId
        );

        String codigo =
                gerarCodigoUnico();

        LocalDateTime agora =
                LocalDateTime.now();

        AcessoMeuDia acesso =
                new AcessoMeuDia();

        acesso.setPessoaAutista(
                pessoa
        );

        acesso.setCodigoHash(
                gerarHash(codigo)
        );

        acesso.setTokenHash(
                null
        );

        acesso.setAtivo(
                true
        );

        acesso.setCriadoEm(
                agora
        );

        acesso.setCodigoExpiraEm(
                agora.plusHours(
                        HORAS_VALIDADE_CODIGO
                )
        );

        acesso.setTokenExpiraEm(
                null
        );

        acesso.setUltimoAcessoEm(
                null
        );

        AcessoMeuDia salvo =
                acessoMeuDiaRepository.save(
                        acesso
                );

        /*
         * O código original aparece somente
         * nesta resposta.
         *
         * O banco guarda apenas o hash.
         */
        return converter(
                salvo,
                codigo
        );
    }

    /*
     * =====================================================
     * RESPONSÁVEL CONSULTA O STATUS DO ACESSO
     * =====================================================
     */

    @Transactional(readOnly = true)
    public AcessoMeuDiaResponseDTO consultar(
            Long usuarioId,
            Long pessoaAutistaId
    ) {

        PessoaAutista pessoa =
                pessoaAutistaService
                        .buscarEntidadeVinculada(
                                pessoaAutistaId,
                                usuarioId
                        );

        pessoaAutistaService
                .validarAcessoMeuDia(
                        pessoa
                );

        AcessoMeuDia acesso =
                acessoMeuDiaRepository
                        .findFirstByPessoaAutistaIdAndAtivoTrueOrderByCriadoEmDesc(
                                pessoaAutistaId
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Nenhum acesso Meu Dia ativo foi encontrado."
                                )
                        );

        /*
         * Nunca devolvemos o código original
         * em uma consulta posterior.
         */
        return converter(
                acesso,
                null
        );
    }

    /*
     * =====================================================
     * LOGIN DA PESSOA AUTISTA PELO CÓDIGO
     * =====================================================
     */

    @Transactional
    public LoginMeuDiaResponseDTO entrar(
            String codigo
    ) {

        String codigoNormalizado =
                normalizarCodigo(
                        codigo
                );

        if (
                codigoNormalizado.length()
                        != TAMANHO_CODIGO
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Código Meu Dia inválido."
            );
        }

        String codigoHash =
                gerarHash(
                        codigoNormalizado
                );

        AcessoMeuDia acesso =
                acessoMeuDiaRepository
                        .findByCodigoHashAndAtivoTrue(
                                codigoHash
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Código Meu Dia inválido."
                                )
                        );

        LocalDateTime agora =
                LocalDateTime.now();

        if (
                acesso.getCodigoExpiraEm() == null ||
                        !acesso.getCodigoExpiraEm()
                                .isAfter(agora)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Este código Meu Dia expirou."
            );
        }

        PessoaAutista pessoa =
                acesso.getPessoaAutista();

        pessoaAutistaService
                .validarAcessoMeuDia(
                        pessoa
                );

        /*
         * Gera uma credencial grande e aleatória
         * para aquele celular.
         */
        String token =
                gerarToken();

        LocalDateTime tokenExpiraEm =
                agora.plusDays(
                        DIAS_VALIDADE_TOKEN
                );

        acesso.setTokenHash(
                gerarHash(token)
        );

        acesso.setTokenExpiraEm(
                tokenExpiraEm
        );

        acesso.setUltimoAcessoEm(
                agora
        );

        /*
         * O código é de uso único.
         *
         * Depois que o celular entra pela primeira
         * vez, o código deixa de funcionar.
         *
         * O acesso continua ativo pelo token.
         */
        acesso.setCodigoExpiraEm(
                agora
        );

        acessoMeuDiaRepository.save(
                acesso
        );

        return new LoginMeuDiaResponseDTO(
                token,
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getNivelAutismo(),
                tokenExpiraEm
        );
    }

    /*
     * =====================================================
     * VALIDA TOKEN NAS ROTAS DO MEU DIA
     * =====================================================
     */

    @Transactional
    public AcessoMeuDia validarToken(
            String token
    ) {

        if (
                token == null ||
                        token.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Token Meu Dia não informado."
            );
        }

        String tokenHash =
                gerarHash(
                        token.trim()
                );

        AcessoMeuDia acesso =
                acessoMeuDiaRepository
                        .findByTokenHashAndAtivoTrue(
                                tokenHash
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Sessão Meu Dia inválida."
                                )
                        );

        LocalDateTime agora =
                LocalDateTime.now();

        if (
                acesso.getTokenExpiraEm() == null ||
                        !acesso.getTokenExpiraEm()
                                .isAfter(agora)
        ) {

            acesso.setAtivo(
                    false
            );

            acessoMeuDiaRepository.save(
                    acesso
            );

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "A sessão Meu Dia expirou."
            );
        }

        PessoaAutista pessoa =
                acesso.getPessoaAutista();

        pessoaAutistaService
                .validarAcessoMeuDia(
                        pessoa
                );

        acesso.setUltimoAcessoEm(
                agora
        );

        acessoMeuDiaRepository.save(
                acesso
        );

        return acesso;
    }

    /*
     * =====================================================
     * RESPONSÁVEL REVOGA O ACESSO
     * =====================================================
     */

    @Transactional
    public void revogar(
            Long usuarioId,
            Long pessoaAutistaId
    ) {

        PessoaAutista pessoa =
                pessoaAutistaService
                        .buscarEntidadeVinculada(
                                pessoaAutistaId,
                                usuarioId
                        );

        pessoaAutistaService
                .validarAcessoMeuDia(
                        pessoa
                );

        List<AcessoMeuDia> acessos =
                acessoMeuDiaRepository
                        .findByPessoaAutistaIdOrderByCriadoEmDesc(
                                pessoaAutistaId
                        );

        boolean encontrouAtivo =
                false;

        for (
                AcessoMeuDia acesso
                : acessos
        ) {

            if (!acesso.isAtivo()) {
                continue;
            }

            acesso.setAtivo(
                    false
            );

            encontrouAtivo =
                    true;
        }

        if (!encontrouAtivo) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Nenhum acesso Meu Dia ativo foi encontrado."
            );
        }

        acessoMeuDiaRepository
                .saveAll(
                        acessos
                );
    }

    /*
     * =====================================================
     * MÉTODOS INTERNOS
     * =====================================================
     */

    private void revogarAcessosAnteriores(
            Long pessoaAutistaId
    ) {

        List<AcessoMeuDia> acessos =
                acessoMeuDiaRepository
                        .findByPessoaAutistaIdOrderByCriadoEmDesc(
                                pessoaAutistaId
                        );

        boolean alterou =
                false;

        for (
                AcessoMeuDia acesso
                : acessos
        ) {

            if (!acesso.isAtivo()) {
                continue;
            }

            acesso.setAtivo(
                    false
            );

            alterou =
                    true;
        }

        if (alterou) {
            acessoMeuDiaRepository
                    .saveAll(
                            acessos
                    );
        }
    }

    private String gerarCodigoUnico() {

        /*
         * Extremamente improvável ter colisão,
         * mas ainda assim verificamos no banco.
         */
        for (
                int tentativa = 0;
                tentativa < 20;
                tentativa++
        ) {

            String codigo =
                    gerarCodigo();

            String hash =
                    gerarHash(
                            codigo
                    );

            if (
                    !acessoMeuDiaRepository
                            .existsByCodigoHash(
                                    hash
                            )
            ) {
                return codigo;
            }
        }

        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível gerar um código Meu Dia."
        );
    }

    private String gerarCodigo() {

        StringBuilder codigo =
                new StringBuilder(
                        TAMANHO_CODIGO
                );

        for (
                int i = 0;
                i < TAMANHO_CODIGO;
                i++
        ) {

            int indice =
                    secureRandom.nextInt(
                            CARACTERES_CODIGO.length()
                    );

            codigo.append(
                    CARACTERES_CODIGO.charAt(
                            indice
                    )
            );
        }

        return codigo.toString();
    }

    private String gerarToken() {

        byte[] bytes =
                new byte[32];

        secureRandom.nextBytes(
                bytes
        );

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(
                        bytes
                );
    }

    private String normalizarCodigo(
            String codigo
    ) {

        if (codigo == null) {
            return "";
        }

        return codigo
                .trim()
                .toUpperCase()
                .replaceAll(
                        "[^A-Z0-9]",
                        ""
                );
    }

    private String gerarHash(
            String valor
    ) {

        try {

            MessageDigest digest =
                    MessageDigest
                            .getInstance(
                                    "SHA-256"
                            );

            byte[] hash =
                    digest.digest(
                            valor.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            StringBuilder hexadecimal =
                    new StringBuilder();

            for (
                    byte item
                    : hash
            ) {

                hexadecimal.append(
                        String.format(
                                "%02x",
                                item
                        )
                );
            }

            return hexadecimal
                    .toString();

        } catch (
                NoSuchAlgorithmException e
        ) {

            throw new IllegalStateException(
                    "SHA-256 não está disponível.",
                    e
            );
        }
    }

    private AcessoMeuDiaResponseDTO converter(
            AcessoMeuDia acesso,
            String codigo
    ) {

        PessoaAutista pessoa =
                acesso.getPessoaAutista();

        return new AcessoMeuDiaResponseDTO(
                acesso.getId(),
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getNivelAutismo(),
                acesso.isAtivo(),
                acesso.getCriadoEm(),
                acesso.getCodigoExpiraEm(),
                acesso.getTokenExpiraEm(),
                acesso.getUltimoAcessoEm(),
                codigo
        );
    }
}