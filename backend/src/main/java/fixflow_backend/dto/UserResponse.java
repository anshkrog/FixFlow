package fixflow_backend.dto;

import fixflow_backend.entity.Role;
import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserResponse(Long id, String name, String email,
                        String phone, Role role,
                        LocalDateTime createdAt,
                        LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}