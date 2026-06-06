package br.com.markFilmes.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("MarkFilmes API")
                .description("API REST para catalogo de filmes e series com busca via OMDB")
                .version("1.0.0")
                .contact(new Contact()
                    .name("MarkFilmes")
                    .url("https://github.com/seu-usuario/markfilmes")));
    }
}
