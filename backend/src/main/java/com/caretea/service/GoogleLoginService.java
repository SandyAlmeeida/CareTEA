package com.caretea.service;

import com.caretea.model.Usuario;
import com.caretea.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.regex.Pattern;

@Service
public class GoogleLoginService {

    private static final Pattern EMAIL_VALIDO =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UsuarioRepository usuarioRepository;
    private final NimbusJwtDecoder googleJwtDecoder;

    public GoogleLoginService(
            UsuarioRepository usuarioRepository,
            @Value("${google.client-id}") String clientId
    ) {
        if (clientId == null || clientId.isBlank() || clientId.contains("${")) {
            throw new IllegalArgumentException("GOOGLE_CLIENT_ID deve estar configurado.");
        }

        this.usuarioRepository = usuarioRepository;
        this.googleJwtDecoder = NimbusJwtDecoder
                .withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .jwsAlgorithm(SignatureAlgorithm.RS256)
                .build();

        this.googleJwtDecoder.setJwtValidator(
                new DelegatingOAuth2TokenValidator<Jwt>(
                        new JwtTimestampValidator(Duration.ZERO),
                        jwt -> {
                            String issuer = jwt.getClaimAsString("iss");
                            boolean issuerValido = "https://accounts.google.com".equals(issuer)
                                    || "accounts.google.com".equals(issuer);
                            boolean audienceValida = jwt.getAudience() != null
                                    && jwt.getAudience().contains(clientId);

                            if (issuerValido && audienceValida && jwt.getExpiresAt() != null) {
                                return OAuth2TokenValidatorResult.success();
                            }

                            return OAuth2TokenValidatorResult.failure(
                                    new OAuth2Error("invalid_token", "ID token do Google inválido.", null)
                            );
                        }
                )
        );
    }

    public Usuario login(String idToken) {

        if (idToken == null || idToken.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe o ID token do Google."
            );
        }

        Jwt identidade;

        try {
            identidade = googleJwtDecoder.decode(idToken);
        } catch (JwtException | IllegalArgumentException erro) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "ID token do Google inválido ou expirado."
            );
        }

        Object emailClaim = identidade.getClaims().get("email");
        Object emailVerificado = identidade.getClaims().get("email_verified");

        if (!(emailClaim instanceof String email)
                || !EMAIL_VALIDO.matcher(email).matches()
                || !Boolean.TRUE.equals(emailVerificado)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "O Google deve fornecer um e-mail válido e verificado."
            );
        }

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Nenhuma conta CareTEA encontrada para este e-mail. Cadastre-se primeiro."
                ));
    }
}
