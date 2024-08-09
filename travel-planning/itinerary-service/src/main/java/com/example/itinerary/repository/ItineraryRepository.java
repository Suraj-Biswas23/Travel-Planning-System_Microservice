// src/main/java/com/example/itinerary/repository/ItineraryRepository.java
package com.example.itinerary.repository;

import com.example.itinerary.model.Itinerary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, String> {
    List<Itinerary> findByUserId(String userId);
}
