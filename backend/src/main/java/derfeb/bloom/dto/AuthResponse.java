package derfeb.bloom.dto;

import derfeb.bloom.model.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Employee user;
}
