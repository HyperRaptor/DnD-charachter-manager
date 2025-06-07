package com.notes.repository;

import com.notes.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface SpeciesRepository extends JpaRepository<Species, UUID> {
    Optional<Species> findByName(String name);

    @Query("SELECT s FROM Species s LEFT JOIN FETCH s.traits WHERE s.id = :id")
    Species findByIdWithTraits(@Param("id") UUID id);

    @Query("SELECT DISTINCT s FROM Species s LEFT JOIN FETCH s.traits")
    List<Species> findAllWithTraits();
} 