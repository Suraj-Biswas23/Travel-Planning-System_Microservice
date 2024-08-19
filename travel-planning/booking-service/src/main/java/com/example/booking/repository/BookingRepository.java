// src/main/java/com/example/booking/repository/BookingRepository.java
package com.example.booking.repository;

import com.example.booking.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    // Additional query methods can be defined here if needed
}