package fixflow_backend.config;

import fixflow_backend.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                /*
                 * Enable CORS.
                 */
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                /*
                 * Disable CSRF because
                 * authentication is stateless JWT.
                 */
                .csrf(csrf ->
                        csrf.disable()
                )

                /*
                 * Do not create HTTP sessions.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                /*
                 * Configure endpoint permissions.
                 */
                .authorizeHttpRequests(auth ->
                        auth

                                .requestMatchers(
                                        "/api/auth/register",
                                        "/api/auth/login"
                                )
                                .permitAll()

                                .anyRequest()
                                .authenticated()
                )

                /*
                 * Run our JWT authentication filter
                 * before Spring's username/password filter.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    /*
     * =========================================================
     * CORS CONFIGURATION
     * =========================================================
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        /*
         * Local:
         * http://localhost:5173
         *
         * Production:
         * value comes from FRONTEND_URL
         */
        configuration.setAllowedOrigins(
                List.of(
                        allowedOrigin
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );


        configuration.setAllowCredentials(
                true
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}