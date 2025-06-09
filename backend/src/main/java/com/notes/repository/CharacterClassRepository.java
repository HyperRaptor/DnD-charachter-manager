package com.notes.repository;

import com.notes.model.CharacterClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface CharacterClassRepository extends JpaRepository<CharacterClass, UUID> {
    @Query("SELECT c FROM CharacterClass c LEFT JOIN FETCH c.features")
    List<CharacterClass> findAllWithFeatures();

    @Query("SELECT c FROM CharacterClass c LEFT JOIN FETCH c.features WHERE c.id = :id")
    CharacterClass findByIdWithFeatures(UUID id);
} 