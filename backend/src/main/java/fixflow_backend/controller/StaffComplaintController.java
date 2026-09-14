package fixflow_backend.controller;

import fixflow_backend.dto.ComplaintResponse;
import fixflow_backend.dto.StatusUpdateRequest;
import fixflow_backend.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/complaints")
@PreAuthorize("hasRole('STAFF')")
public class StaffComplaintController {

    private final ComplaintService complaintService;

    public StaffComplaintController(
            ComplaintService complaintService
    ) {
        this.complaintService = complaintService;
    }


    // GET ALL COMPLAINTS ASSIGNED TO LOGGED-IN STAFF
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>>
    getAssignedComplaints(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                complaintService.getAssignedComplaints(email)
        );
    }


    // UPDATE STATUS OF AN ASSIGNED COMPLAINT
    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse>
    updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(
                        id,
                        request,
                        email
                )
        );
    }
}