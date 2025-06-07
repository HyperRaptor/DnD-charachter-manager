package com.notes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @JsonManagedReference
    @OneToMany(mappedBy = "species", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Trait> traits;

    public Species() {
        this.id = UUID.randomUUID();
    }
} 