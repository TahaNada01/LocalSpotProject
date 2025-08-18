package com.example.demo.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.junit.jupiter.api.Assertions.*;

class NotFoundExceptionTest {

    @Test
    void constructor_ShouldSetMessage() {
        String message = "Resource not found";
        NotFoundException exception = new NotFoundException(message);

        assertEquals(message, exception.getMessage());
    }

    @Test
    void annotation_ShouldHaveCorrectStatus() {
        ResponseStatus annotation = NotFoundException.class.getAnnotation(ResponseStatus.class);

        assertNotNull(annotation);
        assertEquals(HttpStatus.NOT_FOUND, annotation.value());
    }

    @Test
    void inheritance_ShouldExtendRuntimeException() {
        NotFoundException exception = new NotFoundException("test");

        assertTrue(exception instanceof RuntimeException);
    }

    @Test
    void throwException_ShouldWork() {
        String message = "Test not found";

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            throw new NotFoundException(message);
        });

        assertEquals(message, exception.getMessage());
    }
}