package com.simon.leave_calendar_backend.controller;

import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.model.LeaveStatus;
import com.simon.leave_calendar_backend.service.LeaveRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@Tag(name = "Leave Requests")
public class LeaveRequestController {

    private final LeaveRequestService service;

    public LeaveRequestController(LeaveRequestService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List all leave requests, optionally filtered by memberId or status")
    public ResponseEntity<List<LeaveCalendarDto.LeaveRequestDto>> getAll(
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false)LeaveStatus status
    ){
        if (memberId != null){
            return ResponseEntity.ok(service.findByMember(memberId));
        }
        if (status != null){
            return ResponseEntity.ok(service.findByStatus(status));
        }
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single leave request by ID")
    public ResponseEntity<LeaveCalendarDto.LeaveRequestDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new leave request")
    public ResponseEntity<LeaveCalendarDto.LeaveRequestDto> create(
            @Valid @RequestBody LeaveCalendarDto.CreateLeaveRequestDto dto
    ){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update the status of a leave request (PENDING, APPROVED, REJECTED)")
    public ResponseEntity<LeaveCalendarDto.LeaveRequestDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody LeaveCalendarDto.UpdateStatusDto dto
    ){
        return ResponseEntity.ok(service.updateStatus(id, dto.status()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a leave request")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


}
