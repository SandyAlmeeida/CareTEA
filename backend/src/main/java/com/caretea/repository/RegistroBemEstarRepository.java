package com.caretea.repository;

import com.caretea.model.RegistroBemEstar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RegistroBemEstarRepository
        extends JpaRepository<RegistroBemEstar, Long> {

    List<RegistroBemEstar>
    findByUsuarioIdOrderByRegistradoEmDesc(
            Long usuarioId
    );

    List<RegistroBemEstar>
    findByUsuarioIdAndRegistradoEmBetweenOrderByRegistradoEmAsc(
            Long usuarioId,
            LocalDateTime inicio,
            LocalDateTime fim
    );
}