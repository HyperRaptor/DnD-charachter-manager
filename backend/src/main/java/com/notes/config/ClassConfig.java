package com.notes.config;

import com.notes.model.CharacterClass;
import com.notes.model.ClassFeature;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class ClassConfig {
    private static final Map<String, List<FeatureDefinition>> CLASS_FEATURES = new HashMap<>();

    static {
        // Fighter class
        CLASS_FEATURES.put("Fighter", Arrays.asList(
            new FeatureDefinition("Fighting Style", "You have honed your martial prowess and gain a Fighting Style feat of your choice.\nWhenever you gain a Fighter level, you can replace the feat you chose with a different Fighting Style feat.", 1),
            new FeatureDefinition("Second Wind", "You have a limited well of physical and mental stamina that you can draw on. As a Bonus Action, you can use it to regain Hit Points equal to 1d10 plus your Fighter level.\nYou can use this feature twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.\nWhen you reach certain Fighter levels, you gain more uses of this feature, as shown in the Second Wind column of the Fighter Features table.", 1),
            new FeatureDefinition("Action Surge", "You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action, except the Magic action.\nOnce you use this feature, you can’t do so again until you finish a Short or Long Rest. Starting at level 17, you can use it twice before a rest but only once on a turn.", 2),
            new FeatureDefinition("Weapon Mastery", "Your training with weapons allows you to use the mastery properties of three kinds of Simple or Martial weapons of your choice. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices.\nWhen you reach certain Fighter levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Fighter Features table.", 1),
            new FeatureDefinition("Tactical Mind", "You have a mind for tactics on and off the battlefield. When you fail an ability check, you can expend a use of your Second Wind to push yourself toward success. Rather than regaining Hit Points, you roll 1d10 and add the number rolled to the ability check, potentially turning it into a success. If the check still fails, this use of Second Wind isn’t expended.", 2)
        ));

        // Wizard class
        CLASS_FEATURES.put("Wizard", Arrays.asList(
            new FeatureDefinition("Spellcasting", "As a student of arcane magic, you have learned to cast spells.\nCantrips. You know three Wizard cantrips of your choice. Whenever you finish a Long Rest, you can replace one of your cantrips from this feature with another Wizard cantrip of your choice.\nWhen you reach Wizard levels 4 and 10, you learn another Wizard cantrip of your choice, as shown in the Cantrips column of the Wizard Features table.\nSpellbook. Your wizardly apprenticeship culminated in the creation of a unique book: your spellbook. It is a Tiny object that weighs 3 pounds, contains 100 pages, and can be read only by you or someone casting Identify. You determine the book’s appearance and materials, such as a gilt-edged tome or a collection of vellum bound with twine.\nThe book contains the level 1+ spells you know. It starts with six level 1 Wizard spells of your choice.\nWhenever you gain a Wizard level after 1, add two Wizard spells of your choice to your spellbook. Each of these spells must be of a level for which you have spell slots, as shown in the Wizard Features table. The spells are the culmination of arcane research you do regularly.\nSpell Slots. The Wizard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest.\nPrepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To do so, choose four spells from your spellbook. The chosen spells must be of a level for which you have spell slots.\nThe number of spells on your list increases as you gain Wizard levels, as shown in the Prepared Spells column of the Wizard Features table. Whenever that number increases, choose additional Wizard spells until the number of spells on your list matches the number in the table. The chosen spells must be of a level for which you have spell slots. For example, if you’re a level 3 Wizard, your list of prepared spells can include six spells of levels 1 and 2 in any combination, chosen from your spellbook.\nIf another Wizard feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Wizard spells for you.\nChanging Your Prepared Spells. Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with spells from your spellbook.\nSpellcasting Ability. Intelligence is your spellcasting ability for your Wizard spells.\nSpellcasting Focus. You can use an Arcane Focus or your spellbook as a Spellcasting Focus for your Wizard spells.", 1),
            new FeatureDefinition("Arcane Recovery", "You can regain some of your magical energy by studying your spellbook. When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Wizard level (round up), and none of the slots can be level 6 or higher. For example, if you’re a level 4 Wizard, you can recover up to two levels’ worth of spell slots, regaining either one level 2 spell slot or two level 1 spell slots.\nOnce you use this feature, you can’t do so again until you finish a Long Rest.", 1),
            new FeatureDefinition("Ritual Adept", "You can cast any spell as a Ritual if that spell has the Ritual tag and the spell is in your spellbook. You needn’t have the spell prepared, but you must read from the book to cast a spell in this way.", 1),
            new FeatureDefinition("Scholar", "While studying magic, you also specialized in another field of study. Choose one of the following skills in which you have proficiency: Arcana, History, Investigation, Medicine, Nature, or Religion. You have Expertise in the chosen skill.", 2)
        ));
    }

    public static CharacterClass createClass(String name) {
        if (!CLASS_FEATURES.containsKey(name)) {
            throw new IllegalArgumentException("Unknown class: " + name);
        }

        CharacterClass characterClass = new CharacterClass();
        characterClass.setName(name);
        
        // Set hit die based on class
        switch (name) {
            case "Fighter", "Paladin", "Ranger" -> characterClass.setHitDie("d10");
            case "Wizard", "Sorcerer" -> characterClass.setHitDie("d6");
            default -> characterClass.setHitDie("d8");
        }
        
        List<ClassFeature> features = CLASS_FEATURES.get(name).stream()
            .map(def -> {
                ClassFeature feature = new ClassFeature(def.title, def.description, def.level);
                feature.setCharacterClass(characterClass);
                return feature;
            })
            .toList();
        
        characterClass.setFeatures(features);
        return characterClass;
    }

    public static List<String> getAllClassNames() {
        return CLASS_FEATURES.keySet().stream().toList();
    }

    private static class FeatureDefinition {
        final String title;
        final String description;
        final Integer level;

        FeatureDefinition(String title, String description, Integer level) {
            this.title = title;
            this.description = description;
            this.level = level;
        }
    }
} 