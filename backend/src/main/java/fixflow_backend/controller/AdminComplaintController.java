package fixflow_backend.controller;

import fixflow_backend.dto.AssignStaffRequest;
import fixflow_backend.dto.ComplaintResponse;
import fixflow_backend.dto.PriorityUpdateRequest;

import fixflow_backend.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/complaints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminComplaintController {

    private final ComplaintService complaintService;

    public AdminComplaintController(
            ComplaintService complaintService
    ) {
        this.complaintService = complaintService;
    }


    // GET ALL COMPLAINTS
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }


    // UPDATE PRIORITY
    @PatchMapping("/{id}/priority")
    public ResponseEntity<ComplaintResponse> updatePriority(
            @PathVariable Long id,
            @Valid @RequestBody PriorityUpdateRequest request
    ) {

        return ResponseEntity.ok(
                complaintService.updateComplaintPriority(id, request)
        );
    }


    // ASSIGN STAFF
    @PatchMapping("/{id}/assign")
    public ResponseEntity<ComplaintResponse> assignStaff(
            @PathVariable Long id,
            @Valid @RequestBody AssignStaffRequest request
    ) {

        return ResponseEntity.ok(
                complaintService.assignComplaintToStaff(id, request)
        );
    }
}