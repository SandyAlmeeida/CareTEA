package com.caretea.service;

import com.caretea.dto.AnaliseBemEstarIAResponseDTO;
import com.caretea.dto.DashboardBemEstarResponseDTO;
import com.caretea.dto.EvolucaoBemEstarDTO;

import java.util.List;

public interface BemEstarIAClient {

    AnaliseBemEstarIAResponseDTO gerarAnalise(
            DashboardBemEstarResponseDTO resumo,
            List<EvolucaoBemEstarDTO> evolucao,
            AnaliseBemEstarIAResponseDTO analiseBase
    );
}