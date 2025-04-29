package prueba_tecnica.prueba.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Todas las rutas protegidas por CORS
                    .allowedOrigins("http://localhost:3000") // Permitir en react dev
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP
                    .allowedHeaders("*") // Todos los headers
                    .allowCredentials(true); // Permitir cookies o tokens si es necesario
            }
        };
    }
}
