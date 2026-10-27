package com.caretea.repository;

import com.caretea.model.EnvioWhatsapp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnvioWhatsappRepository
        extends JpaRepository<EnvioWhatsapp, Long> {

    List<EnvioWhatsapp> findByLembreteIdOrderByDataTentativaDesc(
            Long lembreteId
    );

    Optional<EnvioWhatsapp> findByMetaMessageId(
            String metaMessageId
    );
}