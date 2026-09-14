package fixflow_backend.dto;

import fixflow_backend.entity.ComplaintStatus;
import fixflow_backend.entity.PriorityLevel;

import java.time.LocalDateTime;

public class ComplaintResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String location;

    private ComplaintStatus status;
    private PriorityLevel priority;

    private Long residentId;
    private String residentName;

    private Long assignedStaffId;
    private String assignedStaffName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public ComplaintResponse() {
    }

    public ComplaintResponse(
            Long id,
            String title,
            String description,
            String category,
            String location,
            ComplaintStatus status,
            PriorityLevel priority,
            Long residentId,
            String residentName,
            Long assignedStaffId,
            String assignedStaffName,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            LocalDateTime resolvedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.status = status;
        this.priority = priority;
        this.residentId = residentId;
        this.residentName = residentName;
        this.assignedStaffId = assignedStaffId;
        this.assignedStaffName = assignedStaffName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public PriorityLevel getPriority() {
        return priority;
    }

    public Long getResidentId() {
        return residentId;
    }

    public String getResidentName() {
        return residentName;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public String getAssignedStaffName() {
        return assignedStaffName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
}