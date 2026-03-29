package com.jobtrail.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * @author Srivathsa Mantrala
 * Class to handle all exceptions on a global level
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        String message = ex.getMessage();
        HttpStatus status = resolveStatus(message);
        return ResponseEntity.status(status).body(Map.of(
                "status", status.value(),
                "error",  message
        ));
    }

    private HttpStatus resolveStatus(String message) {
        if (message == null) return HttpStatus.INTERNAL_SERVER_ERROR;
        String lower = message.toLowerCase();
        if (lower.contains("not found"))     return HttpStatus.NOT_FOUND;
        if (lower.contains("unauthorized") ||
                lower.contains("access denied")) return HttpStatus.FORBIDDEN;
        if (lower.contains("already taken") ||
                lower.contains("only pdf") ||
                lower.contains("exceeds") ||
                lower.contains("empty"))         return HttpStatus.BAD_REQUEST;
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
