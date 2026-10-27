package com.caretea.service;

import java.util.List;

public interface WhatsappService {

    String enviarMensagem(
            String numero,
            String mensagem
    );

    String enviarTemplate(
            String numero,
            String nomeTemplate,
            String idioma,
            List<String> parametros
    );
}