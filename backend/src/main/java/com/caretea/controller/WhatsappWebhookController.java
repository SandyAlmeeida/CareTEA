package com.caretea.controller;

import com.caretea.model.StatusEnvioWhatsapp;
import com.caretea.service.EnvioWhatsappService;
import com.caretea.service.WhatsappService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.Normalizer;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/webhook/whatsapp")
public class WhatsappWebhookController {

    private static final Logger logger =
            LoggerFactory.getLogger(
                    WhatsappWebhookController.class
            );

    private final EnvioWhatsappService envioWhatsappService;
    private final WhatsappService whatsappService;
    private final ObjectMapper objectMapper;

    @Value("${whatsapp.verify-token}")
    private String verifyToken;

    @Value("${whatsapp.app-secret}")
    private String appSecret;

    public WhatsappWebhookController(
            EnvioWhatsappService envioWhatsappService,
            WhatsappService whatsappService,
            ObjectMapper objectMapper
    ) {
        this.envioWhatsappService =
                envioWhatsappService;

        this.whatsappService =
                whatsappService;

        this.objectMapper =
                objectMapper;
    }

    /*
     * GET usado pela Meta para verificar
     * se o webhook pertence ao CareTEA.
     */
    @GetMapping
    public ResponseEntity<String> verificarWebhook(
            @RequestParam(name = "hub.mode") String mode,
            @RequestParam(name = "hub.verify_token") String token,
            @RequestParam(name = "hub.challenge") String challenge
    ) {

        if ("subscribe".equals(mode)
                && verifyToken.equals(token)) {

            return ResponseEntity.ok(
                    challenge
            );
        }

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        "Token de verificação inválido."
                );
    }

    /*
     * POST usado pela Meta para enviar
     * eventos reais do WhatsApp.
     */
    @PostMapping
    public ResponseEntity<Void> receberEvento(
            @RequestBody String payload,
            @RequestHeader(
                    name = "X-Hub-Signature-256",
                    required = false
            ) String assinatura
    ) {

        /*
         * Antes de processar qualquer dado,
         * confirma se o POST realmente veio
         * da Meta.
         */
        if (!assinaturaValida(
                payload,
                assinatura
        )) {

            logger.warn(
                    "Webhook do WhatsApp rejeitado: assinatura inválida."
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        logger.info(
                "Webhook válido do WhatsApp recebido."
        );

        try {

            @SuppressWarnings("unchecked")
            Map<String, Object> payloadMap =
                    objectMapper.readValue(
                            payload,
                            Map.class
                    );

            processarPayload(
                    payloadMap
            );

        } catch (Exception erro) {

            logger.error(
                    "Erro ao processar webhook do WhatsApp: {}",
                    erro.getMessage(),
                    erro
            );
        }

        return ResponseEntity
                .ok()
                .build();
    }

    private boolean assinaturaValida(
            String payload,
            String assinaturaRecebida
    ) {

        if (assinaturaRecebida == null
                || assinaturaRecebida.isBlank()) {

            return false;
        }

        if (!assinaturaRecebida.startsWith(
                "sha256="
        )) {

            return false;
        }

        try {

            Mac mac =
                    Mac.getInstance(
                            "HmacSHA256"
                    );

            SecretKeySpec chave =
                    new SecretKeySpec(
                            appSecret.getBytes(
                                    StandardCharsets.UTF_8
                            ),
                            "HmacSHA256"
                    );

            mac.init(
                    chave
            );

            byte[] hashCalculado =
                    mac.doFinal(
                            payload.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            String hashHex =
                    HexFormat.of()
                            .formatHex(
                                    hashCalculado
                            );

            String assinaturaCalculada =
                    "sha256=" + hashHex;

            return MessageDigest.isEqual(
                    assinaturaCalculada.getBytes(
                            StandardCharsets.UTF_8
                    ),
                    assinaturaRecebida.getBytes(
                            StandardCharsets.UTF_8
                    )
            );

        } catch (Exception erro) {

            logger.error(
                    "Erro ao validar assinatura do webhook: {}",
                    erro.getMessage()
            );

            return false;
        }
    }

    private void processarPayload(
            Map<String, Object> payload
    ) {

        Object entryObject =
                payload.get(
                        "entry"
                );

        if (!(entryObject instanceof List<?> entries)) {
            return;
        }

        for (Object entryObjectItem : entries) {

            if (!(entryObjectItem instanceof Map<?, ?> entry)) {
                continue;
            }

            Object changesObject =
                    entry.get(
                            "changes"
                    );

            if (!(changesObject instanceof List<?> changes)) {
                continue;
            }

            for (Object changeObject : changes) {

                if (!(changeObject instanceof Map<?, ?> change)) {
                    continue;
                }

                Object valueObject =
                        change.get(
                                "value"
                        );

                if (!(valueObject instanceof Map<?, ?> value)) {
                    continue;
                }

                processarMensagens(value);

                Object statusesObject =
                        value.get(
                                "statuses"
                        );

                if (!(statusesObject instanceof List<?> statuses)) {
                    continue;
                }

                for (Object statusObject : statuses) {

                    if (!(statusObject instanceof Map<?, ?> statusMap)) {
                        continue;
                    }

                    processarStatus(
                            statusMap
                    );
                }
            }
        }
    }

    private void processarMensagens(Map<?, ?> value) {

        Object messagesObject = value.get("messages");

        if (!(messagesObject instanceof List<?> messages)) {
            return;
        }

        for (Object messageObject : messages) {

            if (!(messageObject instanceof Map<?, ?> message)
                    || !"text".equals(message.get("type"))) {
                continue;
            }

            if (!(message.get("from") instanceof String remetente)
                    || remetente.isBlank()
                    || !(message.get("text") instanceof Map<?, ?> text)
                    || !(text.get("body") instanceof String conteudo)) {
                continue;
            }

            String textoNormalizado = Normalizer.normalize(
                    conteudo.trim().toLowerCase(Locale.ROOT),
                    Normalizer.Form.NFD
            ).replaceAll("\\p{M}+", "");

            boolean saudacao = switch (textoNormalizado) {
                case "oi", "ola", "bom dia", "boa tarde", "boa noite" -> true;
                default -> false;
            };

            if (!saudacao) {
                continue;
            }

            try {
                whatsappService.enviarMensagem(
                        remetente,
                        "Olá! 💙 Bem-vindo(a) ao CareTEA.\n\n"
                                + "Recebemos sua mensagem. Como podemos ajudar?\n\n"
                                + "Envie sua dúvida por aqui e vamos direcionar seu atendimento."
                );
            } catch (Exception erro) {
                logger.error(
                        "Erro ao enviar resposta automática do WhatsApp. Tipo do erro: {}",
                        erro.getClass().getSimpleName()
                );
            }
        }
    }

    private void processarStatus(
            Map<?, ?> statusMap
    ) {

        Object idObject =
                statusMap.get(
                        "id"
                );

        Object statusObject =
                statusMap.get(
                        "status"
                );

        if (idObject == null
                || statusObject == null) {

            return;
        }

        String metaMessageId =
                idObject.toString();

        String statusMeta =
                statusObject.toString();

        StatusEnvioWhatsapp novoStatus =
                converterStatus(
                        statusMeta
                );

        if (novoStatus == null) {

            logger.info(
                    "Status da Meta ignorado: {}",
                    statusMeta
            );

            return;
        }

        String mensagemErro =
                null;

        if (novoStatus
                == StatusEnvioWhatsapp.FALHOU) {

            mensagemErro =
                    extrairMensagemErro(
                            statusMap
                    );
        }

        boolean atualizado =
                envioWhatsappService
                        .atualizarStatusPorMetaMessageId(
                                metaMessageId,
                                novoStatus,
                                mensagemErro
                        );

        if (atualizado) {

            logger.info(
                    "Status da mensagem {} atualizado para {}.",
                    metaMessageId,
                    novoStatus
            );

        } else {

            logger.warn(
                    "Nenhum envio encontrado para o Meta Message ID {}.",
                    metaMessageId
            );
        }
    }

    private StatusEnvioWhatsapp converterStatus(
            String statusMeta
    ) {

        return switch (
                statusMeta.toLowerCase()
                ) {

            case "sent" ->
                    StatusEnvioWhatsapp.ENVIADO;

            case "delivered" ->
                    StatusEnvioWhatsapp.ENTREGUE;

            case "read" ->
                    StatusEnvioWhatsapp.LIDO;

            case "failed" ->
                    StatusEnvioWhatsapp.FALHOU;

            default ->
                    null;
        };
    }

    private String extrairMensagemErro(
            Map<?, ?> statusMap
    ) {

        Object errorsObject =
                statusMap.get(
                        "errors"
                );

        if (!(errorsObject instanceof List<?> errors)
                || errors.isEmpty()) {

            return "Falha informada pela Meta.";
        }

        Object primeiroErro =
                errors.get(0);

        if (!(primeiroErro instanceof Map<?, ?> erroMap)) {

            return "Falha informada pela Meta.";
        }

        Object titleObject =
                erroMap.get(
                        "title"
                );

        Object messageObject =
                erroMap.get(
                        "message"
                );

        if (messageObject != null) {

            return messageObject.toString();
        }

        if (titleObject != null) {

            return titleObject.toString();
        }

        return "Falha informada pela Meta.";
    }
}
