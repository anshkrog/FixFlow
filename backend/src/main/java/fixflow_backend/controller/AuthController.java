package fixflow_backend.controller;

import fixflow_backend.dto.LoginRequest;
import fixflow_backend.dto.LoginResponse;
import fixflow_backend.dto.RegisterRequest;
import fixflow_backend.dto.UserResponse;

import fixflow_backend.entity.User;

import fixflow_backend.security.JwtService;
import fixflow_backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;


    public AuthController(
            UserService userService,
            JwtService jwtService
    ) {

        this.userService = userService;
        this.jwtService = jwtService;
    }


    /*
     * ---------------------------------------------------------
     * REGISTER USER
     * ---------------------------------------------------------
     */

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user =
                userService.registerUser(
                        request
                );


        UserResponse response =
                new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.getCreatedAt(),
                        user.getUpdatedAt()
                );


        return ResponseEntity.ok(
                response
        );
    }


    /*
     * ---------------------------------------------------------
     * LOGIN USER
     * ---------------------------------------------------------
     */

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(
            @Valid @RequestBody LoginRequest request
    ) {

        /*
         * Validate email and password.
         */
        User user =
                userService.loginUser(
                        request.getEmail(),
                        request.getPassword()
                );


        /*
         * Convert our database User
         * into Spring Security UserDetails.
         */

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" +
                                user
                                        .getRole()
                                        .name()
                );


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
         * Generate JWT.
         *
         * The user's email will be stored
         * as the JWT subject.
         */

        String token =
                jwtService.generateToken(
                        userDetails
                );


        /*
         * Send login response to frontend.
         */

        LoginResponse response =
                new LoginResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        token,
                        "Login successful"
                );


        return ResponseEntity.ok(
                response
        );
    }
}