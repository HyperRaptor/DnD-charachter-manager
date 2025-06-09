package com.notes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
public class ClassFeature {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000, nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer level;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private CharacterClass characterClass;

    public ClassFeature() {
        this.id = UUID.randomUUID();
    }

    public ClassFeature(String title, String description, Integer level) {
        this();
        this.title = title;
        this.description = description;
        this.level = level;
    }
} 