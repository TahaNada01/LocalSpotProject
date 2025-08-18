package com.example.demo.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.junit.jupiter.api.Assertions.*;

class ForbiddenExceptionTest {

    @Test
    void constructor_ShouldSetMessage() {
        String message = "Access forbidden";
        ForbiddenException exception = new ForbiddenException(message);

        assertEquals(message, exception.getMessage());
    }

    @Test
    void annotation_ShouldHaveCorrectStatus() {
        ResponseStatus annotation = ForbiddenException.class.getAnnotation(ResponseStatus.class);

        assertNotNull(annotation);
        assertEquals(HttpStatus.FORBIDDEN, annotation.value());
    }

    @Test
    void inheritance_ShouldExtendRuntimeException() {
        ForbiddenException exception = new ForbiddenException("test");

        assertTrue(exception instanceof RuntimeException);
    }

    @Test
    void throwException_ShouldWork() {
        String message = "Access denied";

        ForbiddenException exception = assertThrows(ForbiddenException.class, () -> {
            throw new ForbiddenException(message);
        });

        assertEquals(message, exception.getMessage());
    }
}