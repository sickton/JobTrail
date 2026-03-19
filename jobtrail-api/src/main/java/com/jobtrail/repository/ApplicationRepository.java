package com.jobtrail.repository;

import com.jobtrail.entity.Application;
import com.jobtrail.entity.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Srivathsa Mantrala
 * Repository interface for applications database communication
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    /**
     * Method that finds the list of applications associated with a user
     * @param userId id of the user
     * @return list of applications created by the user
     */
    List<Application> findByUserUserId(Long userId);

    /**
     * Method that finds the list of applications associated with a status and a given user
     * @param userId id of the user
     * @param status status of the application
     * @return list of applications satisfying constraints
     */
    List<Application> findByUserUserIdAndApplicationStatus(Long userId, ApplicationStatus status);

    /**
     * Method that counts the number of applications logged by a user
     * @param userId id of the user
     * @return count of applications
     */
    long countByUserUserId(Long userId);
}
