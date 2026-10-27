package com.caretea.service;

import com.caretea.dto.AssistenteChatRequestDTO;
import com.caretea.dto.AssistenteChatResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@Service
public class AssistenteIAService {

    private static final int LIMITE_PERGUNTA = 2000;
    private static final int LIMITE_CONTEXTO = 10000;
    private static final String MARCADOR_PERGUNTA = "\nPERGUNTA ATUAL\n";
    private final RestClient restClient;

    public AssistenteIAService(
            @Value("${caretea.ia.base-url:http://localhost:8000}")
            String baseUrl
    ) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(60));

        this.restClient = RestClient
                .builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public AssistenteChatResponseDTO conversar(
            AssistenteChatRequestDTO request
    ) {
        String texto = validar(request);

        AssistenteChatRequestDTO payload =
                new AssistenteChatRequestDTO(
                        texto
                );

        try {
            AssistenteChatResponseDTO resposta =
                    restClient
                        .post()
                        .uri("/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(payload)
                        .retrieve()
                        .body(AssistenteChatResponseDTO.class);

            if (
                    resposta == null ||
                            resposta.getResposta() == null ||
                            resposta.getResposta().isBlank()
            ) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "A Care está indisponível no momento. Tente novamente em instantes."
                );
            }

            return resposta;
        } catch (RestClientException erro) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "A Care está indisponível no momento. Tente novamente em instantes."
            );
        }
    }

    private String validar(
            AssistenteChatRequestDTO request
    ) {
        if (
                request == null ||
                        request.getTexto() == null ||
                        request.getTexto().isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A mensagem não pode estar vazia."
            );
        }

        String texto = request.getTexto().replace("\r\n", "\n").stripLeading();
        int marcador = texto.lastIndexOf(MARCADOR_PERGUNTA);
        String pergunta = marcador >= 0
                ? texto.substring(marcador + MARCADOR_PERGUNTA.length()).strip()
                : texto.strip();

        if (pergunta.isBlank() || pergunta.length() > LIMITE_PERGUNTA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A pergunta deve conter entre 1 e 2000 caracteres."
            );
        }

        if (marcador < 0) {
            return pergunta;
        }

        String contexto = texto.substring(0, marcador);
        if (contexto.length() > LIMITE_CONTEXTO) {
            String avisoReducao = "\n[Contexto reduzido]\n";
            int limiteRecente = LIMITE_CONTEXTO - 3000 - avisoReducao.length();
            contexto = contexto.substring(0, 3000)
                    + avisoReducao
                    + contexto.substring(contexto.length() - limiteRecente);
        }
        return contexto + MARCADOR_PERGUNTA + pergunta;
    }
}
