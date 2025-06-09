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
public class BackgroundFeature {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000, nullable = false)
    private String description;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "background_id", nullable = false)
    private Background background;

    public BackgroundFeature() {
        this.id = UUID.randomUUID();
    }

    public BackgroundFeature(String title, String description) {
        this();
        this.title = title;
        this.description = description;
    }
} 