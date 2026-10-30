package com.caretea.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                .csrf(
                        AbstractHttpConfigurer::disable
                )

                .httpBasic(
                        AbstractHttpConfigurer::disable
                )

                .formLogin(
                        AbstractHttpConfigurer::disable
                )

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )

                /*
                 * Regras de autorização.
                 */
                .authorizeHttpRequests(
                        auth -> auth

                                /*
                                 * Documentação OpenAPI.
                                 */
                                .requestMatchers(
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/v3/api-docs/**"
                                )
                                .permitAll()

                                /*
                                 * Libera requisições OPTIONS
                                 * usadas pelo navegador no CORS.
                                 */
                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()

                                /*
                                 * Cadastro normal do CareTEA.
                                 */
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/usuarios/cadastro"
                                )
                                .permitAll()

                                /*
                                 * Login normal do CareTEA.
                                 */
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/usuarios/login"
                                )
                                .permitAll()

                                /*
                                 * Login com ID token do Google.
                                 */
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/usuarios/login/google"
                                )
                                .permitAll()

                                /*
                                 * Webhook do WhatsApp.
                                 *
                                 * Precisa ser público para a Meta
                                 * conseguir chamar o CareTEA.
                                 */
                                .requestMatchers(
                                        "/webhook/whatsapp"
                                )
                                .permitAll()

                                /*
                                 * Endpoint padrão de erro.
                                 */
                                .requestMatchers(
                                        "/error"
                                )
                                .permitAll()

                                /*
                                 * =================================================
                                 * MEU DIA
                                 * =================================================
                                 */

                                /*
                                 * A pessoa autista precisa conseguir
                                 * enviar o código sem estar logada
                                 * na conta normal do CareTEA.
                                 */
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/acesso-meu-dia/entrar"
                                )
                                .permitAll()

                                /*
                                 * As rotas /meu-dia não usam o JWT
                                 * normal do responsável.
                                 *
                                 * Elas usam:
                                 *
                                 * X-Meu-Dia-Token
                                 *
                                 * e o AcessoMeuDiaService valida
                                 * esse token.
                                 */
                                .requestMatchers(
                                        "/meu-dia/**"
                                )
                                .permitAll()

                                /*
                                 * Todo o restante exige
                                 * autenticação JWT normal.
                                 *
                                 * Isso inclui:
                                 *
                                 * /acesso-meu-dia/gerar
                                 * /acesso-meu-dia/status
                                 * /acesso-meu-dia/revogar
                                 *
                                 * porque essas funções pertencem
                                 * ao responsável.
                                 */
                                .anyRequest()
                                .authenticated()
                )

                /*
                 * Autenticação JWT.
                 */
                .oauth2ResourceServer(
                        oauth2 ->
                                oauth2.jwt(
                                        Customizer.withDefaults()
                                )
                );

        return http.build();
    }
}
