package fixflow_backend.controller;

import fixflow_backend.dto.ComplaintRequest;
import fixflow_backend.dto.ComplaintResponse;
import fixflow_backend.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        ComplaintResponse response =
                complaintService.createComplaint(request, email);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            Authentication authentication
    ) {

        String email = authentication.getName();

        List<ComplaintResponse> complaints =
                complaintService.getMyComplaints(email);

        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<ComplaintResponse> getComplaintById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        ComplaintResponse response =
                complaintService.getComplaintById(id, email);

        return ResponseEntity.ok(response);
    }
}