package com.caretea.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class MetaWhatsappService implements WhatsappService {

    private final RestClient restClient;

    @Value("${whatsapp.token}")
    private String token;

    @Value("${whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${whatsapp.api-version}")
    private String apiVersion;

    public MetaWhatsappService() {

        this.restClient =
                RestClient.builder()
                        .baseUrl(
                                "https://graph.facebook.com"
                        )
                        .build();
    }

    @Override
    public String enviarMensagem(
            String numero,
            String mensagem
    ) {

        Map<String, Object> body =
                Map.of(
                        "messaging_product",
                        "whatsapp",

                        "recipient_type",
                        "individual",

                        "to",
                        numero,

                        "type",
                        "text",

                        "text",
                        Map.of(
                                "preview_url",
                                false,

                                "body",
                                mensagem
                        )
                );

        return enviarRequisicao(
                body
        );
    }

    @Override
    public String enviarTemplate(
            String numero,
            String nomeTemplate,
            String idioma,
            List<String> parametros
    ) {

        List<Map<String, Object>>
                parametrosTemplate =
                parametros.stream()
                        .map(parametro ->
                                Map.<String, Object>of(
                                        "type",
                                        "text",

                                        "text",
                                        parametro
                                )
                        )
                        .toList();

        Map<String, Object> template =
                Map.of(
                        "name",
                        nomeTemplate,

                        "language",
                        Map.of(
                                "code",
                                idioma
                        ),

                        "components",
                        List.of(
                                Map.of(
                                        "type",
                                        "body",

                                        "parameters",
                                        parametrosTemplate
                                )
                        )
                );

        Map<String, Object> body =
                Map.of(
                        "messaging_product",
                        "whatsapp",

                        "recipient_type",
                        "individual",

                        "to",
                        numero,

                        "type",
                        "template",

                        "template",
                        template
                );

        return enviarRequisicao(
                body
        );
    }

    @SuppressWarnings("unchecked")
    private String enviarRequisicao(
            Map<String, Object> body
    ) {

        Map<String, Object> resposta =
                restClient.post()
                        .uri(
                                "/"
                                        + apiVersion
                                        + "/"
                                        + phoneNumberId
                                        + "/messages"
                        )
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
                        .contentType(
                                MediaType.APPLICATION_JSON
                        )
                        .body(
                                body
                        )
                        .retrieve()
                        .body(
                                Map.class
                        );

        if (resposta == null) {

            throw new IllegalStateException(
                    "A Meta não retornou resposta ao enviar a mensagem."
            );
        }

        Object messagesObject =
                resposta.get(
                        "messages"
                );

        if (!(messagesObject instanceof List<?> messages)
                || messages.isEmpty()) {

            throw new IllegalStateException(
                    "A Meta não retornou o ID da mensagem."
            );
        }

        Object primeiraMensagem =
                messages.get(0);

        if (!(primeiraMensagem instanceof Map<?, ?> mensagemMap)) {

            throw new IllegalStateException(
                    "Resposta inesperada da Meta ao enviar a mensagem."
            );
        }

        Object idObject =
                mensagemMap.get(
                        "id"
                );

        if (idObject == null) {

            throw new IllegalStateException(
                    "A Meta não retornou o ID da mensagem."
            );
        }

        return idObject.toString();
    }
}