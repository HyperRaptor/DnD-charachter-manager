package com.notes.config;

import com.notes.model.Background;
import com.notes.model.BackgroundFeature;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class BackgroundConfig {
    private static final Map<String, List<FeatureDefinition>> BACKGROUND_FEATURES = new HashMap<>();

    static {
        // Acolyte background
        BACKGROUND_FEATURES.put("Acolyte", Arrays.asList(
            new FeatureDefinition("Skill Proficiencies", "Insight, Religion"),
            new FeatureDefinition("Tool Proficiencies", "Calligrapher's Supplies"),
            new FeatureDefinition("Feat", "Magic initiate(Cleric)"),
            new FeatureDefinition("Equipment", "Choose A or B: (A) Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP; or (B) 50 GP"),
            new FeatureDefinition("Ability Scores", "Intelligence, Wisdom, Charisma")
        ));

        // Criminal background
        BACKGROUND_FEATURES.put("Criminal", Arrays.asList(
            new FeatureDefinition("Equipment", "Choose A or B: (A) 2 Daggers, Thieves’ Tools, Crowbar, 2 Pouches, Traveler’s Clothes, 16 GP; or (B) 50 GP"),
            new FeatureDefinition("Ability Scores", "Dexterity, Constitution, Intelligence"),
            new FeatureDefinition("Feat", "Alert")
        ));
    }

    public static Background createBackground(String name) {
        if (!BACKGROUND_FEATURES.containsKey(name)) {
            throw new IllegalArgumentException("Unknown background: " + name);
        }

        Background background = new Background();
        background.setName(name);
        
        List<BackgroundFeature> features = BACKGROUND_FEATURES.get(name).stream()
            .map(def -> {
                BackgroundFeature feature = new BackgroundFeature(def.title, def.description);
                feature.setBackground(background);
                return feature;
            })
            .toList();
        
        background.setFeatures(features);
        return background;
    }

    public static List<String> getAllBackgroundNames() {
        return BACKGROUND_FEATURES.keySet().stream().toList();
    }

    private static class FeatureDefinition {
        final String title;
        final String description;

        FeatureDefinition(String title, String description) {
            this.title = title;
            this.description = description;
        }
    }
} 