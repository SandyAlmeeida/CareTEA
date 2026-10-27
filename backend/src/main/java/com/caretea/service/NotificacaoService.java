package com.caretea.service;

import com.caretea.dto.NotificacaoResponseDTO;
import com.caretea.model.Notificacao;
import com.caretea.model.PedidoAjudaMeuDia;
import com.caretea.model.TipoNotificacao;
import com.caretea.model.Usuario;
import com.caretea.repository.NotificacaoRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacaoService(
            NotificacaoRepository notificacaoRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.notificacaoRepository = notificacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<NotificacaoResponseDTO> listarPorUsuario(Long usuarioId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado"
            );
        }

        return notificacaoRepository
                .findByUsuarioIdOrderByCriadaEmDesc(usuarioId)
                .stream()
                .map(NotificacaoResponseDTO::new)
                .toList();
    }

    public Notificacao criarNotificacao(
            Long usuarioId,
            TipoNotificacao tipo,
            String titulo,
            String mensagem
    ) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário não encontrado"
                        )
                );

        Notificacao notificacao = new Notificacao();

        notificacao.setUsuario(usuario);
        notificacao.setTipo(tipo);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setLida(false);

        return notificacaoRepository.save(notificacao);
    }

    @Transactional
    public Notificacao garantirNotificacaoPedidoAjuda(
            Usuario destinatario,
            PedidoAjudaMeuDia pedido
    ) {
        if (destinatario == null || destinatario.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário vinculado à pessoa autista não encontrado."
            );
        }

        if (pedido == null || pedido.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O pedido de ajuda deve estar salvo."
            );
        }

        return notificacaoRepository.findByPedidoAjudaMeuDiaId(pedido.getId())
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(destinatario.getId())
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Usuário não encontrado"
                            ));

                    String nome = pedido.getPessoaAutista() == null
                            ? null
                            : pedido.getPessoaAutista().getNome();
                    String mensagem = nome == null || nome.isBlank()
                            ? "Foi enviado um pedido de ajuda pelo Meu Dia."
                            : nome.trim() + " enviou um pedido de ajuda pelo Meu Dia.";

                    Notificacao notificacao = new Notificacao();
                    notificacao.setUsuario(usuario);
                    notificacao.setPedidoAjudaMeuDia(pedido);
                    notificacao.setTipo(TipoNotificacao.SISTEMA);
                    notificacao.setTitulo("Pedido de ajuda");
                    notificacao.setMensagem(mensagem);
                    notificacao.setLida(false);

                    return notificacaoRepository.save(notificacao);
                });
    }

    @Transactional(readOnly = true)
    public long contarNaoLidas(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado"
            );
        }
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    @Transactional
    public NotificacaoResponseDTO marcarComoLida(Long notificacaoId, Long usuarioAutenticadoId) {

        Notificacao notificacao = notificacaoRepository
                .findById(notificacaoId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Notificação não encontrada"
                        )
                );

        if (!notificacao.getUsuario().getId().equals(usuarioAutenticadoId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para marcar esta notificação como lida."
            );
        }

        if (!notificacao.isLida()) {
            notificacao.setLida(true);
            notificacao.setLidaEm(LocalDateTime.now());

            notificacaoRepository.save(notificacao);
        }

        return new NotificacaoResponseDTO(notificacao);
    }
}
