package derfeb.bloom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Builder
@Accessors(chain = true)
@Table(
    name= "employees",
    uniqueConstraints = {
        @UniqueConstraint(name= "st_email", columnNames = "email")
    }
)
public class Employee implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private String phone;
    private String jobTitle;
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private String employeeCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column()
    private boolean isActive = false;
}
