package com.jobtrail.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * @author Srivathsa Mantrala
 * Class to store resume versions uploaded by the user
 */
@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {
    /** ID assigned to the resume version*/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    private Long resumeId;

    /** Field to store the user associated with the resume version*/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Field to store the version name for the resume*/
    @Column(name = "version_name", nullable = false)
    private String versionName;

    /** Field to store the text of the resume PDF*/
    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    /** Field to store the url of the file*/
    @Column(name = "file_url")
    private String fileUrl;

    /** Field to store the time when a resume version is created and stored*/
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}