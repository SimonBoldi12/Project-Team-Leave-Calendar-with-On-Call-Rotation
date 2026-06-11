package com.simon.leave_calendar_backend.controller;

import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.service.OnCallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/oncall")
@Tag(name = "On-Call Rotation")
public class OnCallController {

    private final OnCallService service;

    public OnCallController(OnCallService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Get on-call schedule. Defaults to current week, 8 weeks ahead.")
    public ResponseEntity<List<LeaveCalendarDto.OnCallWeekDto>> getSchedule(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,

            @RequestParam(defaultValue = "8") int weeks
    ){
        if (from == null) from = LocalDate.now();
        if (weeks < 1 || weeks > 260) weeks = 52;
        return ResponseEntity.ok(service.findSchedule(from, weeks));
    }

    @GetMapping("/current")
    @Operation(summary = "Get on-call info for the current week")
    public ResponseEntity<LeaveCalendarDto.OnCallWeekDto> getCurrent() {
        return ResponseEntity.ok(service.findWeekFor(LocalDate.now()));
    }
}
