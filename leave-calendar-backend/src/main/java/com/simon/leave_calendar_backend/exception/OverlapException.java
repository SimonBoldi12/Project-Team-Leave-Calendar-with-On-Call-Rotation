package com.simon.leave_calendar_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class OverlapException extends RuntimeException {
    public OverlapException(String message) {
        super(message);
    }
}
