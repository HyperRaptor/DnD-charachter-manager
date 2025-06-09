package com.notes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "species_id")
    @NotNull
    private Species species;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "background_id")
    @NotNull
    private Background background;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id")
    @NotNull
    private CharacterClass characterClass;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(nullable = false)
    private Integer temporaryHp = 0;

    @Column(nullable = false)
    private Integer currentHp = 0;

    @Column(nullable = false)
    private Integer maxHp = 0;

    @Column(nullable = false)
    private Integer speed = 0;

    @Column(nullable = false)
    private Integer strength = 0;

    @Column(nullable = false)
    private Integer dexterity = 0;

    @Column(nullable = false)
    private Integer constitution = 0;

    @Column(nullable = false)
    private Integer intelligence = 0;

    @Column(nullable = false)
    private Integer wisdom = 0;

    @Column(nullable = false)
    private Integer charisma = 0;

    @Column(columnDefinition = "TEXT")
    private String coins = "{\"platinum\":0,\"gold\":0,\"electrum\":0,\"silver\":0,\"copper\":0}";

    @Column(columnDefinition = "TEXT")
    private String items = "[]";

    private LocalDateTime createdAt = LocalDateTime.now();

    // Add methods to calculate ability score modifiers
    public Integer getStrengthModifier() {
        return calculateModifier(strength);
    }

    public Integer getDexterityModifier() {
        return calculateModifier(dexterity);
    }

    public Integer getConstitutionModifier() {
        return calculateModifier(constitution);
    }

    public Integer getIntelligenceModifier() {
        return calculateModifier(intelligence);
    }

    public Integer getWisdomModifier() {
        return calculateModifier(wisdom);
    }

    public Integer getCharismaModifier() {
        return calculateModifier(charisma);
    }

    private Integer calculateModifier(Integer score) {
        if (score == null) return 0;
        return (score - 10) / 2;
    }
} 