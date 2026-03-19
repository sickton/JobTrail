package com.jobtrail.entity;

import com.jobtrail.entity.enums.ApplicationStatus;
import com.jobtrail.entity.enums.RoleType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * @author Srivathsa Mantrala
 * Class to store the details of an application, including user and resume version
 */
@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    /** ID assigned to the application*/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    /** Field to store the user associated with the application*/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Field to store a resume version used for the application*/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    /** Field to store the name of the company*/
    @Column(name = "company", nullable = false)
    private String company;

    /** Field to store the name of the role applied for*/
    @Column(name = "role", nullable = false)
    private String role;

    /** Field to store the type of role applied to. Ex: Internship, Fulltime, Coop, etc.*/
    @Enumerated(EnumType.STRING)
    @Column(name = "role_type", nullable = false)
    private RoleType roleType;

    /** Field to store the current status of the application*/
    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus;

    /** Field to store the link of the job as a string*/
    @Column(name = "link")
    private String link;

    /** Field to store the description of the job*/
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Field to store the date and time when application was created*/
    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    /** Field to store the date and time when application is moved to the screening state*/
    @Column(name = "screening_update")
    private LocalDateTime screeningAt;

    /** Field to store the date and time when application is moved to the interview state*/
    @Column(name = "interview_update")
    private LocalDateTime interviewAt;

    /** Field to store the date and time when application is moved to the offered state*/
    @Column(name = "offer_update")
    private LocalDateTime offeredAt;

    /** Field to store the date and time when application is moved to the rejected state*/
    @Column(name = "reject_update")
    private LocalDateTime rejectedAt;

    /** Field to store the date and time when application is moved to the withdrawn state*/
    @Column(name = "withdraw_update")
    private LocalDateTime withdrewAt;

    /** Field to store the date and time when application is updated to any one of the states*/
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
