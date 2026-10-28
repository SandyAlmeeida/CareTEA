package com.caretea.service;

import com.caretea.dto.RegistroBemEstarRequestDTO;
import com.caretea.dto.RegistroBemEstarResponseDTO;
import com.caretea.model.RegistroBemEstar;
import com.caretea.model.Usuario;
import com.caretea.repository.RegistroBemEstarRepository;
import com.caretea.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistroBemEstarService {

    private final RegistroBemEstarRepository registroBemEstarRepository;
    private final UsuarioRepository usuarioRepository;

    public RegistroBemEstarService(
            RegistroBemEstarRepository registroBemEstarRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.registroBemEstarRepository =
                registroBemEstarRepository;

        this.usuarioRepository =
                usuarioRepository;
    }

    public RegistroBemEstarResponseDTO criar(
            RegistroBemEstarRequestDTO dto
    ) {

        validarDados(dto);

        Usuario usuario =
                usuarioRepository
                        .findById(dto.getUsuarioId())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Usuário não encontrado."
                                )
                        );

        RegistroBemEstar registro =
                new RegistroBemEstar();

        registro.setUsuario(
                usuario
        );

        registro.setHumor(
                dto.getHumor()
        );

        registro.setAnsiedade(
                dto.getAnsiedade()
        );

        registro.setEnergia(
                dto.getEnergia()
        );

        registro.setQualidadeSono(
                dto.getQualidadeSono()
        );

        registro.setHorasSono(
                dto.getHorasSono()
        );

        registro.setSobrecargaSensorial(
                dto.getSobrecargaSensorial()
        );

        registro.setObservacao(
                dto.getObservacao()
        );

        RegistroBemEstar salvo =
                registroBemEstarRepository.save(
                        registro
                );

        return new RegistroBemEstarResponseDTO(
                salvo
        );
    }

    public List<RegistroBemEstarResponseDTO>
    listarPorUsuario(
            Long usuarioId
    ) {

        validarUsuario(
                usuarioId
        );

        return registroBemEstarRepository
                .findByUsuarioIdOrderByRegistradoEmDesc(
                        usuarioId
                )
                .stream()
                .map(RegistroBemEstarResponseDTO::new)
                .toList();
    }

    public List<RegistroBemEstarResponseDTO>
    listarPorPeriodo(
            Long usuarioId,
            LocalDateTime inicio,
            LocalDateTime fim
    ) {

        validarUsuario(
                usuarioId
        );

        if (inicio == null || fim == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "As datas de início e fim são obrigatórias."
            );
        }

        if (inicio.isAfter(fim)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data inicial não pode ser posterior à data final."
            );
        }

        return registroBemEstarRepository
                .findByUsuarioIdAndRegistradoEmBetweenOrderByRegistradoEmAsc(
                        usuarioId,
                        inicio,
                        fim
                )
                .stream()
                .map(RegistroBemEstarResponseDTO::new)
                .toList();
    }

    public void excluir(
            Long id,
            Long usuarioAutenticadoId
    ) {

        RegistroBemEstar registro =
                registroBemEstarRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Registro de bem-estar não encontrado."
                                )
                        );

        if (!registro.getUsuario().getId().equals(usuarioAutenticadoId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para excluir esse registro."
            );
        }

        registroBemEstarRepository.delete(
                registro
        );
    }

    private void validarDados(
            RegistroBemEstarRequestDTO dto
    ) {

        if (dto.getUsuarioId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O usuário é obrigatório."
            );
        }

        if (dto.getHumor() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O humor é obrigatório."
            );
        }

        validarEscala(
                dto.getAnsiedade(),
                "ansiedade"
        );

        validarEscala(
                dto.getEnergia(),
                "energia"
        );

        validarEscala(
                dto.getQualidadeSono(),
                "qualidade do sono"
        );

        validarEscala(
                dto.getSobrecargaSensorial(),
                "sobrecarga sensorial"
        );

        if (dto.getHorasSono() != null
                && (dto.getHorasSono() < 0
                || dto.getHorasSono() > 24)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "As horas de sono devem estar entre 0 e 24."
            );
        }

        if (dto.getObservacao() != null
                && dto.getObservacao().length() > 2000) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A observação deve ter no máximo 2000 caracteres."
            );
        }
    }

    private void validarEscala(
            Integer valor,
            String campo
    ) {

        if (valor == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O campo " + campo + " é obrigatório."
            );
        }

        if (valor < 0 || valor > 10) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O campo " + campo
                            + " deve estar entre 0 e 10."
            );
        }
    }

    private void validarUsuario(
            Long usuarioId
    ) {

        if (!usuarioRepository.existsById(
                usuarioId
        )) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado."
            );
        }
    }
}
