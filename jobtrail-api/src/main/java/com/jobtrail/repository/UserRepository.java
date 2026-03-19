package com.jobtrail.repository;

import com.jobtrail.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Srivathsa Mantrala
 * Repository interface to handle the DB communication
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Method that finds a user in database using their username
     * @param username username of the user
     * @return mapped user entity
     */
    Optional<User> findByUsername(String username);

    /**
     * Method that checks if the username exists in the database
     * @param username username of the user
     * @return true if username exists, else false
     */
    boolean existsByUsername(String username);
}
