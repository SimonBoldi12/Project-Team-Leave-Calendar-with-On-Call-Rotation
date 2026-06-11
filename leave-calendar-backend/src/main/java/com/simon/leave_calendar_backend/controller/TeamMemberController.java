package com.simon.leave_calendar_backend.controller;

import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.service.TeamMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@Tag(name = "Team Members")
public class TeamMemberController {

    private final TeamMemberService service;

    public TeamMemberController(TeamMemberService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List all team members")
    public ResponseEntity<List<LeaveCalendarDto.TeamMemberDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
