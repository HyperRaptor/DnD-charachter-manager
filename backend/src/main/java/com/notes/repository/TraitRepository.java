package com.notes.repository;

import com.notes.model.Trait;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TraitRepository extends JpaRepository<Trait, UUID> {
} 