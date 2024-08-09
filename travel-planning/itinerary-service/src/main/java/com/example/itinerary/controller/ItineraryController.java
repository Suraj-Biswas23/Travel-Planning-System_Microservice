// src/main/java/com/example/itinerary/controller/ItineraryController.java
package com.example.itinerary.controller;

import com.example.itinerary.model.Itinerary;
import com.example.itinerary.repository.ItineraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/itineraries")
public class ItineraryController {

    @Autowired
    private ItineraryRepository itineraryRepository;

    @PostMapping
    public Itinerary createItinerary(@RequestBody Itinerary itinerary) {
        return itineraryRepository.save(itinerary);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Itinerary> getItineraryById(@PathVariable String id) {
        Optional<Itinerary> itinerary = itineraryRepository.findById(id);
        return itinerary.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Itinerary> getAllItineraries() {
        return itineraryRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Itinerary> updateItinerary(@PathVariable String id, @RequestBody Itinerary updatedItinerary) {
        return itineraryRepository.findById(id)
                .map(itinerary -> {
                    itinerary.setUserId(updatedItinerary.getUserId());
                    itinerary.setDestinations(updatedItinerary.getDestinations());
                    itinerary.setActivities(updatedItinerary.getActivities());
                    itinerary.setStartDate(updatedItinerary.getStartDate());
                    itinerary.setEndDate(updatedItinerary.getEndDate());
                    itineraryRepository.save(itinerary);
                    return ResponseEntity.ok(itinerary);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItinerary(@PathVariable String id) {
        return itineraryRepository.findById(id)
                .map(itinerary -> {
                    itineraryRepository.delete(itinerary);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
