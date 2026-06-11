package com.simon.leave_calendar_backend.service;

import com.simon.leave_calendar_backend.converter.DtoConverter;
import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.exception.OverlapException;
import com.simon.leave_calendar_backend.exception.ResourceNotFoundException;
import com.simon.leave_calendar_backend.model.LeaveRequest;
import com.simon.leave_calendar_backend.model.LeaveStatus;
import com.simon.leave_calendar_backend.model.TeamMember;
import com.simon.leave_calendar_backend.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRepo;
    private final TeamMemberService memberService;
    private final DtoConverter converter;

    public LeaveRequestService(LeaveRequestRepository leaveRepo, TeamMemberService memberService, DtoConverter converter) {
        this.leaveRepo = leaveRepo;
        this.memberService = memberService;
        this.converter = converter;
    }

    public List<LeaveCalendarDto.LeaveRequestDto> findAll() {
        return leaveRepo.findAll()
                .stream()
                .map(converter::toLeaveRequestDto)
                .toList();
    }

    public List<LeaveCalendarDto.LeaveRequestDto> findByMember(Long memberId){

        memberService.findMemberById(memberId);

        return leaveRepo.findByTeamMemberId(memberId)
                .stream()
                .map(converter::toLeaveRequestDto)
                .toList();
    }

    public List<LeaveCalendarDto.LeaveRequestDto> findByStatus(LeaveStatus status) {
        return leaveRepo.findByStatus(status)
                .stream().
                map(converter::toLeaveRequestDto)
                .toList();
    }

    public LeaveCalendarDto.LeaveRequestDto findById(Long id) {
        return converter.toLeaveRequestDto(findOrThrow(id));
    }

    @Transactional
    public LeaveCalendarDto.LeaveRequestDto create(LeaveCalendarDto.CreateLeaveRequestDto dto){
        validateDates(dto.startDate(), dto.endDate());

        TeamMember member = memberService.findMemberById(dto.teamMemberId());

        checkOverlap(member.getId(), dto.startDate(), dto.endDate(), null);

        LeaveRequest req = new LeaveRequest();
        req.setTeamMember(member);
        req.setStartDate(dto.startDate());
        req.setEndDate(dto.endDate());
        req.setReason(dto.reason());
        req.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRepo.save(req);

        return converter.toLeaveRequestDto(saved);
    }

    @Transactional
    public LeaveCalendarDto.LeaveRequestDto updateStatus(Long id, LeaveStatus newStatus){
        LeaveRequest req = findOrThrow(id);

        if (req.getStatus() == LeaveStatus.REJECTED && newStatus != LeaveStatus.REJECTED) {
            throw new IllegalArgumentException("A rejected leave request cannot be changed to " + newStatus);
        }

        if(newStatus == LeaveStatus.APPROVED) {
            List<LeaveRequest> conflicting = leaveRepo.findOverlapping(
                    req.getTeamMember().getId(),
                    req.getStartDate(),
                    req.getEndDate(),
                    req.getId()
            ).stream()
                    .filter(r -> r.getStatus() == LeaveStatus.APPROVED)
                    .toList();

            if (!conflicting.isEmpty()) {
                throw new OverlapException(
                        "Cannot approve: an approved leave request already exists for this period."
                );
            }
        }

        req.setStatus(newStatus);

        LeaveRequest saved = leaveRepo.save(req);

        return converter.toLeaveRequestDto(saved);

    }

    @Transactional
    public void delete(Long id) {
        LeaveRequest req = findOrThrow(id);
        leaveRepo.delete(req);
    }


    private LeaveRequest findOrThrow(Long id) {
        return leaveRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
    }

    private void validateDates(LocalDate start, LocalDate end) {
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("End date must not be before start date.");
        }
    }

    private void checkOverlap(Long memberId, LocalDate start, LocalDate end, Long excludeId) {
        List<LeaveRequest> overlaps = leaveRepo.findOverlapping(memberId, start, end, excludeId);

        if (!overlaps.isEmpty()) {
            LeaveRequest existing = overlaps.getFirst();
            throw new OverlapException(
                    "A leave request already exists for this period (%s – %s, status: %s)."
                            .formatted(existing.getStartDate(), existing.getEndDate(), existing.getStatus()));
        }
    }

}
