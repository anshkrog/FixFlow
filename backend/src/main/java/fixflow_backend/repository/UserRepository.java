package fixflow_backend.repository;

import fixflow_backend.entity.Role;
import fixflow_backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check whether an email is already registered
    boolean existsByEmail(String email);

    // Get users based on role
    List<User> findByRole(Role role);
}