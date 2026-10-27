package com.caretea.service;

import com.caretea.dto.PedidoAjudaMeuDiaResponseDTO;
import com.caretea.dto.PreferenciaNotificacaoDTO;
import com.caretea.model.AcessoMeuDia;
import com.caretea.model.PedidoAjudaMeuDia;
import com.caretea.model.PessoaAutista;
import com.caretea.repository.PedidoAjudaMeuDiaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoAjudaMeuDiaService {

    private static final Logger logger =
            LoggerFactory.getLogger(PedidoAjudaMeuDiaService.class);

    private final AcessoMeuDiaService acessoMeuDiaService;
    private final PedidoAjudaMeuDiaRepository pedidoAjudaMeuDiaRepository;
    private final PessoaAutistaService pessoaAutistaService;
    private final NotificacaoService notificacaoService;
    private final PreferenciaNotificacaoService preferenciaNotificacaoService;
    private final WhatsappService whatsappService;
    private final EnvioWhatsappService envioWhatsappService;
    private final TransactionTemplate transacaoWhatsapp;

    public PedidoAjudaMeuDiaService(
            AcessoMeuDiaService acessoMeuDiaService,
            PedidoAjudaMeuDiaRepository pedidoAjudaMeuDiaRepository,
            PessoaAutistaService pessoaAutistaService,
            NotificacaoService notificacaoService,
            PreferenciaNotificacaoService preferenciaNotificacaoService,
            WhatsappService whatsappService,
            EnvioWhatsappService envioWhatsappService,
            PlatformTransactionManager transactionManager
    ) {
        this.acessoMeuDiaService =
                acessoMeuDiaService;

        this.pedidoAjudaMeuDiaRepository =
                pedidoAjudaMeuDiaRepository;

        this.pessoaAutistaService =
                pessoaAutistaService;
        this.notificacaoService = notificacaoService;
        this.preferenciaNotificacaoService = preferenciaNotificacaoService;
        this.whatsappService = whatsappService;
        this.envioWhatsappService = envioWhatsappService;
        this.transacaoWhatsapp = new TransactionTemplate(transactionManager);
        this.transacaoWhatsapp.setPropagationBehavior(
                TransactionDefinition.PROPAGATION_REQUIRES_NEW
        );
    }

    @Transactional
    public PedidoAjudaMeuDia pedirAjuda(
            String token
    ) {

        AcessoMeuDia acesso =
                acessoMeuDiaService.validarToken(
                        token
                );

        PessoaAutista pessoaAutista =
                acesso.getPessoaAutista();

        List<PedidoAjudaMeuDia> pendentes =
                pedidoAjudaMeuDiaRepository
                        .findByPessoaAutistaIdAndAtendidoFalseOrderBySolicitadoEmDesc(
                                pessoaAutista.getId()
                        );

        if (!pendentes.isEmpty()) {
            PedidoAjudaMeuDia pedidoPendente = pendentes.get(0);
            notificacaoService.garantirNotificacaoPedidoAjuda(
                    pessoaAutista.getUsuario(), pedidoPendente
            );
            return pedidoPendente;
        }

        PedidoAjudaMeuDia pedido =
                new PedidoAjudaMeuDia();

        pedido.setPessoaAutista(
                pessoaAutista
        );

        pedido.setAtendido(false);

        PedidoAjudaMeuDia salvo = pedidoAjudaMeuDiaRepository.save(
                pedido
        );
        notificacaoService.garantirNotificacaoPedidoAjuda(
                pessoaAutista.getUsuario(), salvo
        );
        prepararWhatsappAposCommit(salvo, pessoaAutista);
        return salvo;
    }

    private void prepararWhatsappAposCommit(
            PedidoAjudaMeuDia pedido,
            PessoaAutista pessoaAutista
    ) {

        try {

            Long usuarioId = pessoaAutista.getUsuario().getId();
            Long pedidoId = pedido.getId();
            String nomePessoaAutista = pessoaAutista.getNome();

            // Isola também falhas na consulta/criação das preferências.
            PreferenciaNotificacaoDTO preferencia =
                    transacaoWhatsapp.execute(status ->
                            preferenciaNotificacaoService.buscarPorUsuario(usuarioId)
                    );

            if (preferencia == null || !preferencia.isWhatsappAtivo()) {
                return;
            }

            String numero = resolverNumeroDestino(pessoaAutista, preferencia);

            if (numero == null || numero.isBlank()) {
                return;
            }

            String destinatario = normalizarNumero(numero);

            if (destinatario.isBlank()
                    || nomePessoaAutista == null
                    || nomePessoaAutista.isBlank()) {
                return;
            }

            if (!TransactionSynchronizationManager.isActualTransactionActive()
                    || !TransactionSynchronizationManager.isSynchronizationActive()) {
                logger.error(
                        "WhatsApp do pedido de ajuda ID {} não agendado: transação ausente.",
                        pedidoId
                );
                return;
            }

            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            enviarWhatsappPedidoAjuda(
                                    pedido, pedidoId, destinatario, nomePessoaAutista
                            );
                        }
                    }
            );

        } catch (Exception erro) {
            logger.error(
                    "Não foi possível preparar WhatsApp do pedido de ajuda ID {}. Tipo do erro: {}",
                    pedido.getId(), erro.getClass().getSimpleName()
            );
        }
    }

    private String resolverNumeroDestino(
            PessoaAutista pessoaAutista,
            PreferenciaNotificacaoDTO preferencia
    ) {

        Integer nivel = pessoaAutista.getNivelAutismo();

        if (nivel == null) {
            return null;
        }

        if (nivel == 1 && preferencia.isEnviarParaAutista()) {
            return pessoaAutista.getUsuario().getWhatsapp();
        }

        if ((nivel == 2 || nivel == 3)
                && preferencia.isEnviarParaResponsavel()
                && pessoaAutista.isEnviarNotificacoesResponsavel()) {
            return pessoaAutista.getWhatsappResponsavel();
        }

        return null;
    }

    private String normalizarNumero(String numero) {

        String somenteNumeros = numero.replaceAll("\\D", "");

        if (!somenteNumeros.isEmpty() && !somenteNumeros.startsWith("55")) {
            somenteNumeros = "55" + somenteNumeros;
        }

        return somenteNumeros;
    }

    private void enviarWhatsappPedidoAjuda(
            PedidoAjudaMeuDia pedido,
            Long pedidoId,
            String destinatario,
            String nomePessoaAutista
    ) {

        String metaMessageId;

        try {
            metaMessageId = whatsappService.enviarTemplate(
                    destinatario,
                    "caretea_pedido_ajuda",
                    "pt_BR",
                    List.of(nomePessoaAutista)
            );
        } catch (Exception erro) {
            logger.error(
                    "Erro ao enviar WhatsApp do pedido de ajuda ID {}. Tipo do erro: {}",
                    pedidoId, erro.getClass().getSimpleName()
            );

            try {
                transacaoWhatsapp.executeWithoutResult(status ->
                        envioWhatsappService.registrarFalhaPedidoAjuda(
                                pedido, destinatario, erro.getMessage()
                        )
                );
            } catch (Exception erroRegistro) {
                logger.error(
                        "Não foi possível registrar falha do WhatsApp do pedido de ajuda ID {}. Tipo do erro: {}",
                        pedidoId, erroRegistro.getClass().getSimpleName()
                );
            }
            return;
        }

        try {
            transacaoWhatsapp.executeWithoutResult(status ->
                    envioWhatsappService.registrarSucessoPedidoAjuda(
                            pedido, destinatario, metaMessageId
                    )
            );
        } catch (Exception erroRegistro) {
            logger.error(
                    "WhatsApp aceito pela Meta, mas não foi possível registrar sucesso do pedido de ajuda ID {}. Tipo do erro: {}",
                    pedidoId, erroRegistro.getClass().getSimpleName()
            );
        }
    }

    @Transactional(readOnly = true)
    public List<PedidoAjudaMeuDiaResponseDTO> listarPendentesDoResponsavel(
            Long usuarioId,
            Long pessoaAutistaId
    ) {

        PessoaAutista pessoaAutista =
                pessoaAutistaService
                        .buscarEntidadeVinculada(
                                pessoaAutistaId,
                                usuarioId
                        );

        return pedidoAjudaMeuDiaRepository
                .findByPessoaAutistaIdAndAtendidoFalseOrderBySolicitadoEmDesc(
                        pessoaAutista.getId()
                )
                .stream()
                .map(
                        this::converterParaDTO
                )
                .toList();
    }

    @Transactional
    public void marcarComoAtendido(
            Long usuarioId,
            Long pedidoId
    ) {

        PedidoAjudaMeuDia pedido =
                pedidoAjudaMeuDiaRepository
                        .findById(
                                pedidoId
                        )
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Pedido de ajuda não encontrado."
                                        )
                        );

        PessoaAutista pessoaAutista =
                pedido.getPessoaAutista();

        /*
         * Confirma que a pessoa deste
         * pedido pertence ao responsável
         * autenticado.
         */
        pessoaAutistaService
                .buscarEntidadeVinculada(
                        pessoaAutista.getId(),
                        usuarioId
                );

        /*
         * Se já foi atendido,
         * simplesmente não faz nada.
         */
        if (pedido.isAtendido()) {
            return;
        }

        pedido.setAtendido(true);

        pedido.setAtendidoEm(
                LocalDateTime.now()
        );

        pedidoAjudaMeuDiaRepository.save(
                pedido
        );
    }

    private PedidoAjudaMeuDiaResponseDTO converterParaDTO(
            PedidoAjudaMeuDia pedido
    ) {

        return new PedidoAjudaMeuDiaResponseDTO(
                pedido.getId(),
                pedido.getPessoaAutista().getId(),
                pedido.getPessoaAutista().getNome(),
                pedido.getSolicitadoEm(),
                pedido.isAtendido()
        );
    }
}
