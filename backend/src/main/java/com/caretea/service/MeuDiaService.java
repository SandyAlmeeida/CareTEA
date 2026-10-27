package com.caretea.service;

import com.caretea.dto.MeuDiaCompromissoDTO;
import com.caretea.dto.MeuDiaMedicamentoDTO;
import com.caretea.dto.MeuDiaResponseDTO;
import com.caretea.model.AcessoMeuDia;
import com.caretea.model.Humor;
import com.caretea.model.Lembrete;
import com.caretea.model.PessoaAutista;
import com.caretea.model.RegistroHumorMeuDia;
import com.caretea.repository.LembreteRepository;
import com.caretea.repository.RegistroHumorMeuDiaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class MeuDiaService {

    private final AcessoMeuDiaService acessoMeuDiaService;

    private final LembreteRepository lembreteRepository;

    private final RegistroHumorMeuDiaRepository
            registroHumorMeuDiaRepository;

    public MeuDiaService(
            AcessoMeuDiaService acessoMeuDiaService,
            LembreteRepository lembreteRepository,
            RegistroHumorMeuDiaRepository registroHumorMeuDiaRepository
    ) {
        this.acessoMeuDiaService =
                acessoMeuDiaService;

        this.lembreteRepository =
                lembreteRepository;

        this.registroHumorMeuDiaRepository =
                registroHumorMeuDiaRepository;
    }

    /*
     * =====================================================
     * PAINEL COMPLETO
     * =====================================================
     */

    @Transactional
    public MeuDiaResponseDTO carregarPainel(
            String token
    ) {

        AcessoMeuDia acesso =
                acessoMeuDiaService
                        .validarToken(
                                token
                        );

        PessoaAutista pessoa =
                acesso.getPessoaAutista();

        LocalDate hoje =
                LocalDate.now();

        List<MeuDiaMedicamentoDTO> medicamentos =
                buscarMedicamentos();

        List<MeuDiaCompromissoDTO> compromissos =
                buscarCompromissos(
                        pessoa,
                        hoje
                );

        String humorHoje =
                buscarHumorHoje(
                        pessoa.getId(),
                        hoje
                );

        return new MeuDiaResponseDTO(
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getNivelAutismo(),
                hoje,
                humorHoje,
                medicamentos,
                compromissos
        );
    }

    /*
     * =====================================================
     * MEDICAMENTOS
     * =====================================================
     *
     * O frontend de Medicamentos existe,
     * mas Medicamento.java e
     * MedicamentoRepository.java ainda
     * não existem neste backend.
     *
     * Mantemos o contrato pronto.
     *
     * Quando o módulo for integrado,
     * só este método precisará mudar.
     */

    private List<MeuDiaMedicamentoDTO>
    buscarMedicamentos() {

        return List.of();
    }

    /*
     * =====================================================
     * CONFIRMAÇÃO DE DOSE
     * =====================================================
     *
     * A estrutura RegistroDoseMedicamento
     * já está pronta.
     *
     * Porém só podemos confirmar uma dose
     * quando o backend de Medicamentos existir,
     * pois precisamos validar se aquele
     * medicamento realmente pertence ao perfil.
     */

    public void confirmarDose(
            String token,
            Long medicamentoId
    ) {

        /*
         * Valida pelo menos a sessão Meu Dia.
         */
        acessoMeuDiaService
                .validarToken(
                        token
                );

        if (medicamentoId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O medicamento é obrigatório."
            );
        }

        throw new ResponseStatusException(
                HttpStatus.NOT_IMPLEMENTED,
                "O módulo de medicamentos ainda não está integrado ao backend."
        );
    }

    /*
     * =====================================================
     * COMPROMISSOS DO DIA
     * =====================================================
     */

    private List<MeuDiaCompromissoDTO>
    buscarCompromissos(
            PessoaAutista pessoa,
            LocalDate hoje
    ) {

        if (
                pessoa.getUsuario() == null ||
                        pessoa.getUsuario()
                                .getId() == null
        ) {
            return List.of();
        }

        Long usuarioId =
                pessoa.getUsuario()
                        .getId();

        List<Lembrete> lembretes =
                lembreteRepository
                        .findByUsuarioIdOrderByDataHoraAsc(
                                usuarioId
                        );

        List<MeuDiaCompromissoDTO> resultado =
                new ArrayList<>();

        for (
                Lembrete lembrete
                : lembretes
        ) {

            if (
                    lembrete.getDataHora() == null
            ) {
                continue;
            }

            /*
             * Mostra apenas os compromissos
             * da data atual.
             */
            if (
                    !lembrete
                            .getDataHora()
                            .toLocalDate()
                            .equals(hoje)
            ) {
                continue;
            }

            String tipo =
                    lembrete.getTipo() != null
                            ? String.valueOf(
                            lembrete.getTipo()
                    )
                            : "COMPROMISSO";

            /*
             * Quando Medicamentos entrar,
             * ele terá uma área própria.
             */
            if (
                    "MEDICAMENTO"
                            .equalsIgnoreCase(
                                    tipo
                            )
            ) {
                continue;
            }

            String titulo =
                    primeiroTextoDisponivel(
                            lembrete.getTitulo(),
                            lembrete.getNomeReferencia(),
                            "Compromisso"
                    );

            String detalhe =
                    primeiroTextoDisponivel(
                            lembrete.getDetalheReferencia(),
                            lembrete.getMensagem(),
                            null
                    );

            resultado.add(
                    new MeuDiaCompromissoDTO(
                            lembrete.getId(),
                            tipo,
                            titulo,
                            detalhe,
                            lembrete.getDataHora()
                    )
            );
        }

        return resultado;
    }

    /*
     * =====================================================
     * HUMOR DE HOJE
     * =====================================================
     */

    private String buscarHumorHoje(
            Long pessoaAutistaId,
            LocalDate hoje
    ) {

        return registroHumorMeuDiaRepository
                .findByPessoaAutistaIdAndDataRegistro(
                        pessoaAutistaId,
                        hoje
                )
                .map(
                        registro ->
                                registro
                                        .getHumor()
                                        .name()
                )
                .orElse(
                        null
                );
    }

    /*
     * =====================================================
     * REGISTRA OU ALTERA O HUMOR
     * =====================================================
     */

    @Transactional
    public String registrarHumor(
            String token,
            String humorRecebido
    ) {

        AcessoMeuDia acesso =
                acessoMeuDiaService
                        .validarToken(
                                token
                        );

        PessoaAutista pessoa =
                acesso.getPessoaAutista();

        Humor humor =
                converterHumor(
                        humorRecebido
                );

        LocalDate hoje =
                LocalDate.now();

        RegistroHumorMeuDia registro =
                registroHumorMeuDiaRepository
                        .findByPessoaAutistaIdAndDataRegistro(
                                pessoa.getId(),
                                hoje
                        )
                        .orElseGet(
                                RegistroHumorMeuDia::new
                        );

        registro.setPessoaAutista(
                pessoa
        );

        registro.setHumor(
                humor
        );

        registro.setDataRegistro(
                hoje
        );

        registroHumorMeuDiaRepository.save(
                registro
        );

        return humor.name();
    }

    /*
     * =====================================================
     * CONVERSÃO DO HUMOR
     * =====================================================
     */

    private Humor converterHumor(
            String valor
    ) {

        if (
                valor == null ||
                        valor.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O humor é obrigatório."
            );
        }

        String normalizado =
                valor
                        .trim()
                        .toUpperCase()
                        .replace(
                                "-",
                                "_"
                        )
                        .replace(
                                " ",
                                "_"
                        );

        /*
         * O Meu Dia usa só três estados.
         */
        if (
                !normalizado.equals(
                        "BEM"
                ) &&
                        !normalizado.equals(
                                "NEUTRO"
                        ) &&
                        !normalizado.equals(
                                "MAL"
                        )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Humor inválido para o Meu Dia."
            );
        }

        try {

            return Humor.valueOf(
                    normalizado
            );

        } catch (
                IllegalArgumentException e
        ) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Humor não reconhecido pelo sistema."
            );
        }
    }

    /*
     * =====================================================
     * AUXILIAR
     * =====================================================
     */

    private String primeiroTextoDisponivel(
            String primeiro,
            String segundo,
            String padrao
    ) {

        if (
                primeiro != null &&
                        !primeiro.isBlank()
        ) {
            return primeiro;
        }

        if (
                segundo != null &&
                        !segundo.isBlank()
        ) {
            return segundo;
        }

        return padrao;
    }
}