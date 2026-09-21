package com.caretea.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Libera o acesso do front (Vite) à API. As origens permitidas podem ser
 * ajustadas via propriedade caretea.cors.origins (separadas por vírgula).
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${caretea.cors.origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String[] origensPermitidas;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(origensPermitidas)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
