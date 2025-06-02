package com.notes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Species {
    @Id
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> traits;

    public Species() {
        this.id = UUID.randomUUID();
    }
} 