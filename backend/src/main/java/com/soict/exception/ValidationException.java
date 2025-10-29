package com.soict.exception;

import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {
    private final java.util.Map<String, String> errors;

    public ValidationException(String message) {
        super(message);
        this.errors = new java.util.HashMap<>();
    }

    public ValidationException(String message, java.util.Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }
}
