package com.caretea.service;

import com.caretea.dto.LembreteRequestDTO;
import com.caretea.dto.LembreteResponseDTO;
import com.caretea.dto.PreferenciaNotificacaoDTO;
import com.caretea.model.Lembrete;
import com.caretea.model.PessoaAutista;
import com.caretea.model.TipoNotificacao;
import com.caretea.model.Usuario;
import com.caretea.repository.LembreteRepository;
import com.caretea.repository.PessoaAutistaRepository;
import com.caretea.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class LembreteService {

    private static final Logger logger =
            LoggerFactory.getLogger(LembreteService.class);

    private final LembreteRepository lembreteRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;
    private final PreferenciaNotificacaoService preferenciaNotificacaoService;
    private final WhatsappService whatsappService;
    private final PessoaAutistaRepository pessoaAutistaRepository;
    private final EnvioWhatsappService envioWhatsappService;

    public LembreteService(
            LembreteRepository lembreteRepository,
            UsuarioRepository usuarioRepository,
            NotificacaoService notificacaoService,
            PreferenciaNotificacaoService preferenciaNotificacaoService,
            WhatsappService whatsappService,
            PessoaAutistaRepository pessoaAutistaRepository,
            EnvioWhatsappService envioWhatsappService
    ) {
        this.lembreteRepository = lembreteRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
        this.preferenciaNotificacaoService =
                preferenciaNotificacaoService;
        this.whatsappService = whatsappService;
        this.pessoaAutistaRepository =
                pessoaAutistaRepository;
        this.envioWhatsappService =
                envioWhatsappService;
    }

    public LembreteResponseDTO criar(
            LembreteRequestDTO dto
    ) {

        Usuario usuario =
                usuarioRepository.findById(
                        dto.getUsuarioId()
                ).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"
                        )
                );

        Lembrete lembrete =
                new Lembrete();

        lembrete.setUsuario(usuario);
        lembrete.setTipo(dto.getTipo());
        lembrete.setTitulo(dto.getTitulo());
        lembrete.setMensagem(dto.getMensagem());
        lembrete.setDataHora(dto.getDataHora());

        lembrete.setNomeReferencia(
                dto.getNomeReferencia()
        );

        lembrete.setDetalheReferencia(
                dto.getDetalheReferencia()
        );

        lembrete.setAtivo(true);
        lembrete.setEnviado(false);

        Lembrete salvo =
                lembreteRepository.save(lembrete);

        return new LembreteResponseDTO(
                salvo
        );
    }

    public List<LembreteResponseDTO> listarPorUsuario(
            Long usuarioId
    ) {

        if (!usuarioRepository.existsById(usuarioId)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado"
            );
        }

        return lembreteRepository
                .findByUsuarioIdOrderByDataHoraAsc(
                        usuarioId
                )
                .stream()
                .map(LembreteResponseDTO::new)
                .toList();
    }

    public LembreteResponseDTO buscarPorId(
            Long id
    ) {

        Lembrete lembrete =
                lembreteRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Lembrete não encontrado"
                                )
                        );

        return new LembreteResponseDTO(
                lembrete
        );
    }

    public void excluir(
            Long id
    ) {

        Lembrete lembrete =
                lembreteRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Lembrete não encontrado"
                                )
                        );

        lembreteRepository.delete(
                lembrete
        );
    }

    @Scheduled(fixedRate = 60000)
    public void verificarLembretes() {

        LocalDateTime agora =
                LocalDateTime.now();

        List<Lembrete> lembretes =
                lembreteRepository
                        .findByAtivoTrueAndEnviadoFalseAndDataHoraLessThanEqual(
                                agora
                        );

        for (Lembrete lembrete : lembretes) {

            try {

                notificacaoService.criarNotificacao(
                        lembrete.getUsuario().getId(),
                        lembrete.getTipo(),
                        lembrete.getTitulo(),
                        lembrete.getMensagem()
                );

                try {

                    enviarWhatsappSePermitido(
                            lembrete
                    );

                } catch (Exception erroWhatsapp) {

                    logger.error(
                            "Erro geral ao processar WhatsApp do lembrete ID {}: {}",
                            lembrete.getId(),
                            erroWhatsapp.getMessage()
                    );
                }

                lembrete.setEnviado(true);

                lembreteRepository.save(
                        lembrete
                );

            } catch (Exception erro) {

                logger.error(
                        "Erro ao processar lembrete ID {}: {}",
                        lembrete.getId(),
                        erro.getMessage()
                );
            }
        }
    }

    private void enviarWhatsappSePermitido(
            Lembrete lembrete
    ) {

        Long usuarioId =
                lembrete.getUsuario().getId();

        PreferenciaNotificacaoDTO preferencia =
                preferenciaNotificacaoService
                        .buscarPorUsuario(
                                usuarioId
                        );

        if (!preferencia.isWhatsappAtivo()) {
            return;
        }

        if (!tipoPermitido(
                preferencia,
                lembrete.getTipo()
        )) {
            return;
        }

        if (!possuiTemplate(
                lembrete.getTipo()
        )) {
            return;
        }

        List<String> numeros =
                buscarNumerosDestino(
                        lembrete.getUsuario(),
                        preferencia
                );

        if (numeros.isEmpty()) {

            logger.warn(
                    "Nenhum destinatário de WhatsApp encontrado para o lembrete ID {}.",
                    lembrete.getId()
            );

            return;
        }

        for (String numero : numeros) {

            try {

                /*
                 * A Meta devolve o ID único
                 * da mensagem enviada.
                 *
                 * Exemplo:
                 * wamid.HBgM...
                 */
                String metaMessageId =
                        enviarTemplatePorTipo(
                                lembrete,
                                numero
                        );

                /*
                 * Salva o envio junto com
                 * o ID retornado pela Meta.
                 */
                envioWhatsappService
                        .registrarSucesso(
                                lembrete,
                                numero,
                                metaMessageId
                        );

                logger.info(
                        "WhatsApp do lembrete ID {} aceito pela Meta. Message ID: {}",
                        lembrete.getId(),
                        metaMessageId
                );

            } catch (Exception erro) {

                String mensagemErro =
                        erro.getMessage();

                try {

                    envioWhatsappService
                            .registrarFalha(
                                    lembrete,
                                    numero,
                                    mensagemErro
                            );

                } catch (Exception erroRegistro) {

                    logger.error(
                            "Não foi possível registrar a falha do WhatsApp do lembrete ID {}: {}",
                            lembrete.getId(),
                            erroRegistro.getMessage()
                    );
                }

                logger.error(
                        "Erro ao enviar WhatsApp do lembrete ID {}: {}",
                        lembrete.getId(),
                        mensagemErro
                );
            }
        }
    }

    private boolean tipoPermitido(
            PreferenciaNotificacaoDTO preferencia,
            TipoNotificacao tipo
    ) {

        return switch (tipo) {

            case MEDICAMENTO ->
                    preferencia.isMedicamentoAtivo();

            case CONSULTA ->
                    preferencia.isConsultaAtivo();

            case EXAME ->
                    preferencia.isExameAtivo();

            case LEMBRETE ->
                    preferencia.isLembreteAtivo();

            case SISTEMA ->
                    false;
        };
    }

    private boolean possuiTemplate(
            TipoNotificacao tipo
    ) {

        return tipo == TipoNotificacao.MEDICAMENTO
                || tipo == TipoNotificacao.CONSULTA
                || tipo == TipoNotificacao.EXAME;
    }

    private List<String> buscarNumerosDestino(
            Usuario usuario,
            PreferenciaNotificacaoDTO preferencia
    ) {

        List<PessoaAutista> pessoasAutistas =
                pessoaAutistaRepository
                        .findByUsuarioId(
                                usuario.getId()
                        );

        Set<String> numeros =
                new LinkedHashSet<>();

        if (pessoasAutistas.isEmpty()) {

            if (preferencia.isEnviarParaAutista()) {

                adicionarNumero(
                        numeros,
                        usuario.getWhatsapp()
                );
            }

            return new ArrayList<>(
                    numeros
            );
        }

        for (PessoaAutista pessoaAutista
                : pessoasAutistas) {

            Integer nivel =
                    pessoaAutista.getNivelAutismo();

            if (nivel == null) {
                continue;
            }

            /*
             * NÍVEL 1
             *
             * Pode receber diretamente.
             * O responsável também pode receber,
             * caso esteja habilitado.
             */
            if (nivel == 1) {

                if (preferencia
                        .isEnviarParaAutista()) {

                    adicionarNumero(
                            numeros,
                            usuario.getWhatsapp()
                    );
                }

                if (preferencia
                        .isEnviarParaResponsavel()
                        && pessoaAutista
                        .isEnviarNotificacoesResponsavel()) {

                    adicionarNumero(
                            numeros,
                            pessoaAutista
                                    .getWhatsappResponsavel()
                    );
                }
            }

            /*
             * NÍVEIS 2 E 3
             *
             * Somente o responsável recebe.
             */
            if (nivel == 2 || nivel == 3) {

                if (preferencia
                        .isEnviarParaResponsavel()) {

                    String whatsappResponsavel =
                            pessoaAutista
                                    .getWhatsappResponsavel();

                    if (whatsappResponsavel != null
                            && !whatsappResponsavel.isBlank()) {

                        adicionarNumero(
                                numeros,
                                whatsappResponsavel
                        );

                    } else {

                        adicionarNumero(
                                numeros,
                                usuario.getWhatsapp()
                        );
                    }
                }
            }
        }

        return new ArrayList<>(
                numeros
        );
    }

    private void adicionarNumero(
            Set<String> numeros,
            String numero
    ) {

        if (numero == null
                || numero.isBlank()) {

            return;
        }

        numeros.add(
                normalizarNumero(numero)
        );
    }

    private String enviarTemplatePorTipo(
            Lembrete lembrete,
            String numero
    ) {

        return switch (lembrete.getTipo()) {

            case MEDICAMENTO ->
                    enviarTemplateMedicamento(
                            lembrete,
                            numero
                    );

            case CONSULTA ->
                    enviarTemplateConsulta(
                            lembrete,
                            numero
                    );

            case EXAME ->
                    enviarTemplateExame(
                            lembrete,
                            numero
                    );

            default ->
                    throw new IllegalArgumentException(
                            "Não existe template de WhatsApp para o tipo "
                                    + lembrete.getTipo()
                    );
        };
    }

    private String enviarTemplateMedicamento(
            Lembrete lembrete,
            String numero
    ) {

        DateTimeFormatter horario =
                DateTimeFormatter.ofPattern(
                        "HH:mm"
                );

        return whatsappService.enviarTemplate(
                numero,
                "caretea_medicamento",
                "pt_BR",
                List.of(
                        lembrete.getNomeReferencia(),
                        lembrete.getDetalheReferencia(),
                        lembrete.getDataHora()
                                .format(horario)
                )
        );
    }

    private String enviarTemplateConsulta(
            Lembrete lembrete,
            String numero
    ) {

        DateTimeFormatter dataHora =
                DateTimeFormatter.ofPattern(
                        "dd/MM/yyyy 'às' HH:mm"
                );

        return whatsappService.enviarTemplate(
                numero,
                "caretea_consulta",
                "pt_BR",
                List.of(
                        lembrete.getNomeReferencia(),
                        lembrete.getDataHora()
                                .format(dataHora)
                )
        );
    }

    private String enviarTemplateExame(
            Lembrete lembrete,
            String numero
    ) {

        DateTimeFormatter dataHora =
                DateTimeFormatter.ofPattern(
                        "dd/MM/yyyy 'às' HH:mm"
                );

        return whatsappService.enviarTemplate(
                numero,
                "caretea_exame",
                "pt_BR",
                List.of(
                        lembrete.getNomeReferencia(),
                        lembrete.getDataHora()
                                .format(dataHora)
                )
        );
    }

    private String normalizarNumero(
            String numero
    ) {

        String somenteNumeros =
                numero.replaceAll(
                        "\\D",
                        ""
                );

        if (!somenteNumeros.startsWith("55")) {

            somenteNumeros =
                    "55" + somenteNumeros;
        }

        return somenteNumeros;
    }
}