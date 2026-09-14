package fixflow_backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class RoleTestController {

    @GetMapping("/resident")
    @PreAuthorize("hasRole('RESIDENT')")
    public String residentEndpoint() {
        return "Welcome Resident! You are authorized.";
    }

    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF')")
    public String staffEndpoint() {
        return "Welcome Staff! You are authorized.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "Welcome Admin! You are authorized.";
    }
}