// src/main/java/com/example/user/repository/UserRepository.java
package com.example.user.repository;

import com.example.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}
