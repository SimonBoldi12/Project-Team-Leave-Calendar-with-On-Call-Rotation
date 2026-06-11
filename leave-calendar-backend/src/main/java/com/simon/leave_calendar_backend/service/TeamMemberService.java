package com.simon.leave_calendar_backend.service;

import com.simon.leave_calendar_backend.converter.DtoConverter;
import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import com.simon.leave_calendar_backend.exception.ResourceNotFoundException;
import com.simon.leave_calendar_backend.model.TeamMember;
import com.simon.leave_calendar_backend.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository repository;
    private final DtoConverter converter;

    public TeamMemberService(TeamMemberRepository repository, DtoConverter converter) {
        this.repository = repository;
        this.converter = converter;
    }

    public List<LeaveCalendarDto.TeamMemberDto> findAll(){
        return repository.findAll()
                .stream()
                .map(converter::toMemberDto)
                .toList();
    }

    public TeamMember findMemberById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team member not found with id: " + id
                ));
    }

}
