package com.notes.config;

import com.notes.model.Species;
import com.notes.model.Trait;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class SpeciesConfig {
    private static final Map<String, List<TraitDefinition>> SPECIES_TRAITS = new HashMap<>();

    static {
        //Aasimar traits
        SPECIES_TRAITS.put("Aasimar", Arrays.asList(
            new TraitDefinition("Ability Score Increase.", "When determining your character's ability scores, increase one score by 2 and increase a different score by 1, or increase three different scores by 1. You can't raise any of your scores above 20."),
            new TraitDefinition("Creature Type.", "You are a Humanoid."),
            new TraitDefinition("Size.", "You are Medium or Small. You choose the size when you select this race."),
            new TraitDefinition("Speed.", "Your walking speed is 30 feet."),
            new TraitDefinition("Darkvision. ", "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray."),
            new TraitDefinition("Celestial Resistance.", "You have resistance to necrotic damage and radiant damage."),
            new TraitDefinition("Healing Hands.", "As an action, you can touch a creature and roll a number of d4s equal to your proficiency bonus. The creature regains a number of hit points equal to the total rolled. Once you use this trait, you can't use it again until you finish a long rest."),
            new TraitDefinition("Light Bearer.", "You know the Light cantrip. Charisma is your spellcasting ability for it."),
            new TraitDefinition("Celestial Revelation.", "When you reach 3rd level, choose one of the revelation options below. Thereafter, you can use a bonus action to unleash the celestial energy within yourself, gaining the benefits of that revelation. Your transformation lasts for 1 minute or until you end it as a bonus action. Once you transform using your revelation below, you can't use it again until you finish a long rest. Necrotic Shroud. Your eyes briefly become pools of darkness, and ghostly, flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you that can see you must succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn. Until the transformation ends, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your proficiency bonus. Radiant Consumption. Searing light temporarily radiates from your eyes and mouth. For the duration, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes radiant damage equal to your proficiency bonus. Until the transformation ends, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your proficiency bonus. Radiant Soul. Two luminous, spectral wings sprout from your back temporarily. Until the transformation ends, you have a flying speed equal to your walking speed, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your proficiency bonus."),
            new TraitDefinition("Languages.", "Your character can speak, read, and write Common and one other language that you and your DM agree is appropriate for the character. The Player's Handbook offers a list of languages to choose from. The DM is free to modify that list for a campaign.")
        ));

        //Dragonborn traits
        SPECIES_TRAITS.put("Dragonborn", Arrays.asList(
            new TraitDefinition("Ability Score Increase.", "When determining your character's ability scores, increase one score by 2 and increase a different score by 1, or increase three different scores by 1. You can't raise any of your scores above 20."),
            new TraitDefinition("Creature Type.", "You are a Humanoid."),
            new TraitDefinition("Size.", "Medium (about 5–7 feet tall)"),
            new TraitDefinition("Speed.", "Your walking speed is 30 feet."),
            new TraitDefinition("Dragon Ancestry.", "Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance."),
            new TraitDefinition("Breath Weapon.", "When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide (choose the shape each time). Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, a creature takes half as much damage. This damage increases by 1d10 when you reach character levels 5 (2d10), 11 (3d10), and 17 (4d10). You can use this Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest."),
            new TraitDefinition("Damage Resistance.", "You have resistance to the type of damage associated with your Draconic Ancestry trait."),
            new TraitDefinition("Darkvision.", "You have Darkvision with a range of 60 feet."),
            new TraitDefinition("Draconic Flight.", "When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract the wings (no action required) or have the Incapacitated condition. During that time, you have a Fly Speed equal to your Speed. Your wings appear to be made of the same energy as your Breath Weapon. Once you use this trait, you can't use it again until you finish a Long Rest."),
            new TraitDefinition("Languages.", "Your character can speak, read, and write Common and one other language that you and your DM agree is appropriate for the character. The Player's Handbook offers a list of languages to choose from. The DM is free to modify that list for a campaign.")
        ));

        // Dwarf traits
        SPECIES_TRAITS.put("Dwarf", Arrays.asList(
            new TraitDefinition("Creature Type.", "Humanoid."),
            new TraitDefinition("Size.", "Medium (about 4–5 feet tall)."),
            new TraitDefinition("Speed.", "30 feet."),
            new TraitDefinition("Darkvision.", "You have Darkvision with a range of 120 feet."),
            new TraitDefinition("Dwarven Resilience.", "You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition."),
            new TraitDefinition("Dwarven Toughness.", "Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level."),
            new TraitDefinition("Stonecunning", "As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. The stone can be natural or worked. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.")
        ));

        // Human traits
        SPECIES_TRAITS.put("Halfling", Arrays.asList(
            new TraitDefinition("Creature Type.", "Humanoid."),
            new TraitDefinition("Size.", "Small (about 2–3 feet tall)."),
            new TraitDefinition("Speed.", "30 feet."),
            new TraitDefinition("Brave.", "You have Advantage on saving throws you make to avoid or end the Frightened condition."),
            new TraitDefinition("Halfling Nimbleness.", "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space."),
            new TraitDefinition("Luck.", "When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll."),
            new TraitDefinition("Naturally Stealthy.", "You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.")
        ));

        // Halfling traits
        SPECIES_TRAITS.put("Human", Arrays.asList(
            new TraitDefinition("Creature Type.", "Humanoid."),
            new TraitDefinition("Size.", "Medium (about 4–7 feet tall) or Small (about 2–4 feet tall), chosen when you select this species."),
            new TraitDefinition("Speed.", "30 feet."),
            new TraitDefinition("Resourceful", "You gain Heroic Inspiration whenever you finish a Long Rest."),
            new TraitDefinition("Skillful", "You gain proficiency in one skill of your choice."),
            new TraitDefinition("Versatile", "You gain an Origin feat of your choice.")
        ));
    }

    public static Species createSpecies(String name) {
        if (!SPECIES_TRAITS.containsKey(name)) {
            throw new IllegalArgumentException("Unknown species: " + name);
        }

        Species species = new Species();
        species.setName(name);
        
        List<Trait> traits = SPECIES_TRAITS.get(name).stream()
            .map(def -> {
                Trait trait = new Trait(def.title, def.description);
                trait.setSpecies(species);
                return trait;
            })
            .toList();
        
        species.setTraits(traits);
        return species;
    }

    public static List<String> getAllSpeciesNames() {
        return SPECIES_TRAITS.keySet().stream().toList();
    }

    private static class TraitDefinition {
        final String title;
        final String description;

        TraitDefinition(String title, String description) {
            this.title = title;
            this.description = description;
        }
    }
} 