package com.notes.repository;

import com.notes.model.Background;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface BackgroundRepository extends JpaRepository<Background, UUID> {
    @Query("SELECT b FROM Background b LEFT JOIN FETCH b.features")
    List<Background> findAllWithFeatures();

    @Query("SELECT b FROM Background b LEFT JOIN FETCH b.features WHERE b.id = :id")
    Background findByIdWithFeatures(UUID id);
} 