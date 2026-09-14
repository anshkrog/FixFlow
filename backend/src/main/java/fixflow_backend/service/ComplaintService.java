package fixflow_backend.service;

import fixflow_backend.dto.AssignStaffRequest;
import fixflow_backend.dto.ComplaintRequest;
import fixflow_backend.dto.ComplaintResponse;
import fixflow_backend.dto.PriorityUpdateRequest;
import fixflow_backend.dto.StatusUpdateRequest;

import fixflow_backend.entity.Complaint;
import fixflow_backend.entity.ComplaintStatus;
import fixflow_backend.entity.PriorityLevel;
import fixflow_backend.entity.Role;
import fixflow_backend.entity.User;

import fixflow_backend.exception.ComplaintNotFoundException;
import fixflow_backend.exception.UnauthorizedComplaintAccessException;

import fixflow_backend.repository.ComplaintRepository;
import fixflow_backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository
    ) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // 1. CREATE COMPLAINT - RESIDENT
    // =========================================================
    public ComplaintResponse createComplaint(
            ComplaintRequest request,
            String email
    ) {

        User resident = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation())
                .status(ComplaintStatus.OPEN)
                .priority(PriorityLevel.MEDIUM)
                .resident(resident)
                .build();

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(savedComplaint);
    }


    // =========================================================
    // 2. GET LOGGED-IN RESIDENT'S COMPLAINTS
    // =========================================================
    public List<ComplaintResponse> getMyComplaints(String email) {

        User resident = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        List<Complaint> complaints =
                complaintRepository.findByResident(resident);

        return complaints.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // 3. GET ONE COMPLAINT BY ID - RESIDENT
    // =========================================================
    public ComplaintResponse getComplaintById(
            Long complaintId,
            String email
    ) {

        User resident = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found"
                        )
                );

        if (!complaint.getResident()
                .getId()
                .equals(resident.getId())) {

            throw new UnauthorizedComplaintAccessException(
                    "You are not authorized to view this complaint"
            );
        }

        return mapToResponse(complaint);
    }


    // =========================================================
    // 4. GET ALL COMPLAINTS - ADMIN
    // =========================================================
    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // 5. UPDATE PRIORITY - ADMIN
    // =========================================================
    public ComplaintResponse updateComplaintPriority(
            Long complaintId,
            PriorityUpdateRequest request
    ) {

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found"
                        )
                );

        complaint.setPriority(request.getPriority());

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }


    // =========================================================
    // 6. ASSIGN COMPLAINT TO STAFF - ADMIN
    // =========================================================
    public ComplaintResponse assignComplaintToStaff(
            Long complaintId,
            AssignStaffRequest request
    ) {

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found"
                        )
                );

        User staff = userRepository
                .findById(request.getStaffId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Staff user not found"
                        )
                );

        if (staff.getRole() != Role.STAFF) {
            throw new RuntimeException(
                    "Selected user is not a STAFF member"
            );
        }

        complaint.setAssignedStaff(staff);
        complaint.setStatus(ComplaintStatus.ASSIGNED);

        // In case a resolved complaint is reassigned
        complaint.setResolvedAt(null);

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }


    // =========================================================
    // 7. GET ASSIGNED COMPLAINTS - STAFF
    // =========================================================
    public List<ComplaintResponse> getAssignedComplaints(
            String email
    ) {

        User staff = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Staff user not found"
                        )
                );

        if (staff.getRole() != Role.STAFF) {
            throw new RuntimeException(
                    "User is not a STAFF member"
            );
        }

        List<Complaint> complaints =
                complaintRepository.findByAssignedStaff(staff);

        return complaints.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // 8. UPDATE COMPLAINT STATUS - STAFF
    // =========================================================
    public ComplaintResponse updateComplaintStatus(
            Long complaintId,
            StatusUpdateRequest request,
            String email
    ) {

        User staff = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Staff user not found"
                        )
                );

        if (staff.getRole() != Role.STAFF) {
            throw new RuntimeException(
                    "User is not a STAFF member"
            );
        }

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new ComplaintNotFoundException(
                                "Complaint not found"
                        )
                );

        // Complaint must actually be assigned to this staff member
        if (complaint.getAssignedStaff() == null ||
                !complaint.getAssignedStaff()
                        .getId()
                        .equals(staff.getId())) {

            throw new UnauthorizedComplaintAccessException(
                    "This complaint is not assigned to you"
            );
        }

        ComplaintStatus newStatus =
                request.getStatus();

        /*
         * Staff should not manually move complaints back to OPEN
         * or ASSIGNED.
         *
         * OPEN is created by the resident.
         * ASSIGNED is controlled by the admin.
         */
        if (newStatus != ComplaintStatus.IN_PROGRESS &&
                newStatus != ComplaintStatus.RESOLVED) {

            throw new IllegalArgumentException(
                    "Staff can only change status to IN_PROGRESS or RESOLVED"
            );
        }

        complaint.setStatus(newStatus);

        // Automatically save completion time
        if (newStatus == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(
                    LocalDateTime.now()
            );
        } else {
            complaint.setResolvedAt(null);
        }

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }


    // =========================================================
    // 9. ENTITY -> SAFE RESPONSE DTO
    // =========================================================
    private ComplaintResponse mapToResponse(
            Complaint complaint
    ) {

        Long assignedStaffId = null;
        String assignedStaffName = null;

        if (complaint.getAssignedStaff() != null) {

            assignedStaffId =
                    complaint.getAssignedStaff().getId();

            assignedStaffName =
                    complaint.getAssignedStaff().getName();
        }

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getCategory(),
                complaint.getLocation(),
                complaint.getStatus(),
                complaint.getPriority(),
                complaint.getResident().getId(),
                complaint.getResident().getName(),
                assignedStaffId,
                assignedStaffName,
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                complaint.getResolvedAt()
        );
    }
}