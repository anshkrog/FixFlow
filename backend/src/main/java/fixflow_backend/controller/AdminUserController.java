package fixflow_backend.controller;

import fixflow_backend.dto.StaffResponse;
import fixflow_backend.entity.Role;
import fixflow_backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<StaffResponse>> getStaffMembers() {

        List<StaffResponse> staffMembers =
                userRepository.findByRole(Role.STAFF)
                        .stream()
                        .map(user ->
                                new StaffResponse(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(staffMembers);
    }
}