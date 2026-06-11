package com.simon.leave_calendar_backend.exception;

import com.simon.leave_calendar_backend.dto.LeaveCalendarDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<LeaveCalendarDto.ErrorDto> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new LeaveCalendarDto.ErrorDto(ex.getMessage()));
    }

    @ExceptionHandler(OverlapException.class)
    public ResponseEntity<LeaveCalendarDto.ErrorDto> handleOverlap(OverlapException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new LeaveCalendarDto.ErrorDto(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<LeaveCalendarDto.ErrorDto> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new LeaveCalendarDto.ErrorDto(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<LeaveCalendarDto.ErrorDto>> handleValidation(MethodArgumentNotValidException ex) {
        List<LeaveCalendarDto.ErrorDto> errors = ex.getBindingResult().getFieldErrors().stream()
                .map((FieldError fe) -> new LeaveCalendarDto.ErrorDto(fe.getDefaultMessage(), fe.getField()))
                .toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
