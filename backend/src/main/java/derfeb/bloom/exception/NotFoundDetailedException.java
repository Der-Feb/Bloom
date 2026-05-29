package derfeb.bloom.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundDetailedException extends RuntimeException {
    public String details;

    public NotFoundDetailedException(String s, String details) {
        super(s);
        this.details = details;
    }
}
