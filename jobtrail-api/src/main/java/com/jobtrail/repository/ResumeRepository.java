package com.jobtrail.repository;

import com.jobtrail.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Srivathsa Mantrala
 * Repository interface for Resume database communication
 */
@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    /**
     * Method that finds a list of resumes used by a user
     * @param userId id of the user
     * @return list of resumes created and used by the user
     */
    List<Resume> findByUserUserId(Long userId);

    /**
     * Method to find a particular resume using the resume id and user if
     * @param resumeId id of the resume
     * @param userId id of the user
     * @return resume if found
     */
    Optional<Resume> findByResumeIdAndUserUserId(Long resumeId, Long userId);
}
