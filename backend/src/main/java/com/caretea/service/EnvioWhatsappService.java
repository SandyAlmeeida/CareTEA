package com.caretea.service;

import com.caretea.dto.EnvioWhatsappResponseDTO;
import com.caretea.model.EnvioWhatsapp;
import com.caretea.model.Lembrete;
import com.caretea.model.PedidoAjudaMeuDia;
import com.caretea.model.StatusEnvioWhatsapp;
import com.caretea.model.TipoNotificacao;
import com.caretea.repository.EnvioWhatsappRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnvioWhatsappService {

    private final EnvioWhatsappRepository envioWhatsappRepository;

    public EnvioWhatsappService(
            EnvioWhatsappRepository envioWhatsappRepository
    ) {
        this.envioWhatsappRepository =
                envioWhatsappRepository;
    }

    public EnvioWhatsappResponseDTO registrarSucesso(
            Lembrete lembrete,
            String destinatario,
            String metaMessageId
    ) {

        EnvioWhatsapp envio =
                new EnvioWhatsapp();

        envio.setLembrete(
                lembrete
        );

        envio.setDestinatario(
                destinatario
        );

        envio.setTipo(
                lembrete.getTipo()
        );

        envio.setStatus(
                StatusEnvioWhatsapp.ENVIADO
        );

        envio.setMetaMessageId(
                metaMessageId
        );

        envio.setMensagemErro(
                null
        );

        EnvioWhatsapp salvo =
                envioWhatsappRepository.save(
                        envio
                );

        return new EnvioWhatsappResponseDTO(
                salvo
        );
    }

    public EnvioWhatsappResponseDTO registrarFalha(
            Lembrete lembrete,
            String destinatario,
            String mensagemErro
    ) {

        EnvioWhatsapp envio =
                new EnvioWhatsapp();

        envio.setLembrete(
                lembrete
        );

        envio.setDestinatario(
                destinatario
        );

        envio.setTipo(
                lembrete.getTipo()
        );

        envio.setStatus(
                StatusEnvioWhatsapp.FALHOU
        );

        envio.setMetaMessageId(
                null
        );

        envio.setMensagemErro(
                limitarMensagemErro(
                        mensagemErro
                )
        );

        EnvioWhatsapp salvo =
                envioWhatsappRepository.save(
                        envio
                );

        return new EnvioWhatsappResponseDTO(
                salvo
        );
    }

    public EnvioWhatsappResponseDTO registrarSucessoPedidoAjuda(
            PedidoAjudaMeuDia pedido,
            String destinatario,
            String metaMessageId
    ) {

        EnvioWhatsapp envio =
                new EnvioWhatsapp();

        envio.setLembrete(
                null
        );

        envio.setPedidoAjudaMeuDia(
                pedido
        );

        envio.setDestinatario(
                destinatario
        );

        envio.setTipo(
                TipoNotificacao.SISTEMA
        );

        envio.setStatus(
                StatusEnvioWhatsapp.ENVIADO
        );

        envio.setMetaMessageId(
                metaMessageId
        );

        envio.setMensagemErro(
                null
        );

        EnvioWhatsapp salvo =
                envioWhatsappRepository.save(
                        envio
                );

        return new EnvioWhatsappResponseDTO(
                salvo
        );
    }

    public EnvioWhatsappResponseDTO registrarFalhaPedidoAjuda(
            PedidoAjudaMeuDia pedido,
            String destinatario,
            String mensagemErro
    ) {

        EnvioWhatsapp envio =
                new EnvioWhatsapp();

        envio.setLembrete(
                null
        );

        envio.setPedidoAjudaMeuDia(
                pedido
        );

        envio.setDestinatario(
                destinatario
        );

        envio.setTipo(
                TipoNotificacao.SISTEMA
        );

        envio.setStatus(
                StatusEnvioWhatsapp.FALHOU
        );

        envio.setMetaMessageId(
                null
        );

        envio.setMensagemErro(
                limitarMensagemErro(
                        mensagemErro
                )
        );

        EnvioWhatsapp salvo =
                envioWhatsappRepository.save(
                        envio
                );

        return new EnvioWhatsappResponseDTO(
                salvo
        );
    }

    public List<EnvioWhatsappResponseDTO> listarPorLembrete(
            Long lembreteId
    ) {

        return envioWhatsappRepository
                .findByLembreteIdOrderByDataTentativaDesc(
                        lembreteId
                )
                .stream()
                .map(EnvioWhatsappResponseDTO::new)
                .toList();
    }

    public boolean atualizarStatusPorMetaMessageId(
            String metaMessageId,
            StatusEnvioWhatsapp novoStatus,
            String mensagemErro
    ) {

        Optional<EnvioWhatsapp> envioOptional =
                envioWhatsappRepository
                        .findByMetaMessageId(
                                metaMessageId
                        );

        if (envioOptional.isEmpty()) {
            return false;
        }

        EnvioWhatsapp envio =
                envioOptional.get();

        envio.setStatus(
                novoStatus
        );

        if (novoStatus
                == StatusEnvioWhatsapp.FALHOU) {

            envio.setMensagemErro(
                    limitarMensagemErro(
                            mensagemErro
                    )
            );

        } else {

            envio.setMensagemErro(
                    null
            );
        }

        envioWhatsappRepository.save(
                envio
        );

        return true;
    }

    private String limitarMensagemErro(
            String mensagemErro
    ) {

        if (mensagemErro == null) {
            return null;
        }

        if (mensagemErro.length() > 2000) {

            return mensagemErro.substring(
                    0,
                    2000
            );
        }

        return mensagemErro;
    }
}
