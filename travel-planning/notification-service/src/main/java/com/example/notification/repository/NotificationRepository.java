// src/main/java/com/example/notification/repository/NotificationRepository.java
package com.example.notification.repository;

import com.example.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    // Additional query methods can be defined here if needed
}