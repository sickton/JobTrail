package com.jobtrail.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * @author Srivathsa Mantrala
 * Class to maintain user information for the application
 */
@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    /** ID assigned to the user*/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long userId;

    /** Field to store the first name of the user*/
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /** Field to store the last name of the user*/
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /** Field to store the username of the user. Has maximum length of 25 characters and must be unique*/
    @Column(name = "username", nullable = false, unique = true, length = 25)
    private String username;

    /** Field to store the hashed string of password for the user*/
    @Column(name = "pwd_hash", nullable = false)
    private String passwordHash;

    /** Field that stores the time stamp of when the user created their account on the system*/
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}