package fixflow_backend.security;

import fixflow_backend.entity.User;
import fixflow_backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        /*
         * ---------------------------------------------------------
         * 1. Read Authorization header
         * ---------------------------------------------------------
         */

        String authHeader =
                request.getHeader("Authorization");


        /*
         * No JWT supplied.
         * Continue request normally.
         */

        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        /*
         * ---------------------------------------------------------
         * 2. Extract JWT
         * ---------------------------------------------------------
         */

        String token =
                authHeader.substring(7);


        try {

            /*
             * -----------------------------------------------------
             * 3. Extract email from token subject
             * -----------------------------------------------------
             */

            String email =
                    jwtService.extractUsername(
                            token
                    );


            /*
             * Only authenticate if:
             *
             * - token contains an email
             * - Spring Security has not already authenticated user
             */

            if (
                    email != null &&
                            SecurityContextHolder
                                    .getContext()
                                    .getAuthentication()
                                    == null
            ) {


                /*
                 * -------------------------------------------------
                 * 4. Find user in database
                 * -------------------------------------------------
                 */

                User user =
                        userRepository
                                .findByEmail(email)
                                .orElse(null);


                if (user != null) {


                    /*
                     * -------------------------------------------------
                     * 5. Build user's Spring Security authority
                     *
                     * Example:
                     *
                     * RESIDENT -> ROLE_RESIDENT
                     * ADMIN    -> ROLE_ADMIN
                     * STAFF    -> ROLE_STAFF
                     * -------------------------------------------------
                     */

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" +
                                            user
                                                    .getRole()
                                                    .name()
                            );


                    /*
                     * -------------------------------------------------
                     * 6. Build UserDetails for JWT validation
                     * -------------------------------------------------
                     */

                    UserDetails userDetails =
                            org.springframework.security.core.userdetails.User
                                    .withUsername(
                                            user.getEmail()
                                    )
                                    .password(
                                            user.getPassword()
                                    )
                                    .authorities(
                                            authority
                                    )
                                    .build();


                    /*
                     * -------------------------------------------------
                     * 7. Validate JWT
                     * -------------------------------------------------
                     */

                    if (
                            jwtService.isTokenValid(
                                    token,
                                    userDetails
                            )
                    ) {


                        /*
                         * -------------------------------------------------
                         * 8. Create Spring authenticated user
                         * -------------------------------------------------
                         */

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user.getEmail(),
                                        null,
                                        List.of(
                                                authority
                                        )
                                );


                        /*
                         * -------------------------------------------------
                         * 9. Put authentication into SecurityContext
                         * -------------------------------------------------
                         */

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(
                                        authentication
                                );
                    }
                }
            }

        } catch (Exception exception) {

            /*
             * Invalid / expired / malformed JWT.
             *
             * We intentionally do not authenticate the request.
             * Spring Security will reject protected endpoints.
             */

            SecurityContextHolder
                    .clearContext();
        }


        /*
         * ---------------------------------------------------------
         * 10. Continue filter chain
         * ---------------------------------------------------------
         */

        filterChain.doFilter(
                request,
                response
        );
    }
}