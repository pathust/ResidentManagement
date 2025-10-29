package com.soict.exception;

public enum ErrorCode {
    // General Errors
    INTERNAL_SERVER_ERROR("INTERNAL_001", "Internal server error"),
    RESOURCE_NOT_FOUND("RESOURCE_001", "Resource not found"),
    DUPLICATE_RESOURCE("RESOURCE_002", "Resource already exists"),
    VALIDATION_ERROR("VALIDATION_001", "Validation error"),

    // Authentication & Authorization
    UNAUTHORIZED("AUTH_001", "Unauthorized access"),
    FORBIDDEN("AUTH_002", "Access forbidden"),
    BAD_CREDENTIALS("AUTH_003", "Invalid credentials"),
    TOKEN_EXPIRED("AUTH_004", "Token has expired"),
    INVALID_TOKEN("AUTH_005", "Invalid token"),

    // Business Logic Errors
    HOUSEHOLD_HEAD_CHANGE_ERROR("BUSINESS_001", "Cannot change household head"),
    PERSON_ALREADY_IN_HOUSEHOLD("BUSINESS_002", "Person already belongs to a household"),
    INVALID_DATE_RANGE("BUSINESS_003", "Invalid date range"),
    OVERLAPPING_PERIOD("BUSINESS_004", "Period overlaps with existing record"),
    INSUFFICIENT_FUND_BALANCE("BUSINESS_005", "Insufficient fund balance"),
    COLLECTION_ALREADY_CLOSED("BUSINESS_006", "Collection event already closed"),

    // Data Integrity Errors
    DATA_INTEGRITY_VIOLATION("DATA_001", "Data integrity violation"),
    FOREIGN_KEY_CONSTRAINT("DATA_002", "Foreign key constraint violation"),
    UNIQUE_CONSTRAINT_VIOLATION("DATA_003", "Unique constraint violation");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
