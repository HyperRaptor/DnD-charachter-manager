package com.notes.repository;

import com.notes.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface SpeciesRepository extends JpaRepository<Species, UUID> {
    Optional<Species> findByName(String name);
} 