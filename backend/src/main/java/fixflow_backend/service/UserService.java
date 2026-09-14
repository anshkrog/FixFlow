package fixflow_backend.service;

import fixflow_backend.dto.RegisterRequest;
import fixflow_backend.entity.Role;
import fixflow_backend.entity.User;
import fixflow_backend.exception.InvalidCredentialsException;
import fixflow_backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER USER
    // =========================
    public User registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.RESIDENT)
                .build();

        return userRepository.save(user);
    }

    // =========================
    // LOGIN USER
    // =========================
    public User loginUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        return user;
    }
}