package com.notes.controller;

import com.notes.model.Character;
import com.notes.model.Species;
import com.notes.model.Background;
import com.notes.model.CharacterClass;
import com.notes.repository.CharacterRepository;
import com.notes.repository.SpeciesRepository;
import com.notes.repository.BackgroundRepository;
import com.notes.repository.CharacterClassRepository;
import com.notes.config.SpeciesConfig;
import com.notes.config.BackgroundConfig;
import com.notes.config.ClassConfig;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CharacterController {
    private static final Logger logger = LoggerFactory.getLogger(CharacterController.class);

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    @Autowired
    private BackgroundRepository backgroundRepository;

    @Autowired
    private CharacterClassRepository characterClassRepository;

    @PostConstruct
    public void init() {
        try {
            // Initialize species if they don't exist
            if (speciesRepository.count() == 0) {
                logger.info("Initializing species data...");
                for (String speciesName : SpeciesConfig.getAllSpeciesNames()) {
                    try {
                        Species species = SpeciesConfig.createSpecies(speciesName);
                        Species savedSpecies = speciesRepository.save(species);
                        logger.info("Created {} species with ID: {}", speciesName, savedSpecies.getId());
                    } catch (Exception e) {
                        logger.error("Error creating species {}: {}", speciesName, e.getMessage());
                    }
                }
                logger.info("Species initialization complete");
            } else {
                logger.info("Species already exist, skipping initialization");
            }

            // Initialize backgrounds if they don't exist
            if (backgroundRepository.count() == 0) {
                logger.info("Initializing background data...");
                for (String backgroundName : BackgroundConfig.getAllBackgroundNames()) {
                    try {
                        Background background = BackgroundConfig.createBackground(backgroundName);
                        Background savedBackground = backgroundRepository.save(background);
                        logger.info("Created {} background with ID: {}", backgroundName, savedBackground.getId());
                    } catch (Exception e) {
                        logger.error("Error creating background {}: {}", backgroundName, e.getMessage());
                    }
                }
                logger.info("Background initialization complete");
            } else {
                logger.info("Backgrounds already exist, skipping initialization");
            }

            // Initialize classes if they don't exist
            if (characterClassRepository.count() == 0) {
                logger.info("Initializing class data...");
                for (String className : ClassConfig.getAllClassNames()) {
                    try {
                        CharacterClass characterClass = ClassConfig.createClass(className);
                        CharacterClass savedClass = characterClassRepository.save(characterClass);
                        logger.info("Created {} class with ID: {}", className, savedClass.getId());
                    } catch (Exception e) {
                        logger.error("Error creating class {}: {}", className, e.getMessage());
                    }
                }
                logger.info("Class initialization complete");
            } else {
                logger.info("Classes already exist, skipping initialization");
            }

            // Create debug character if no characters exist
            if (characterRepository.count() == 0) {
                logger.info("Creating debug character...");
                try {
                    // Get the first available species, background, and class
                    List<Species> speciesList = speciesRepository.findAll();
                    List<Background> backgroundList = backgroundRepository.findAll();
                    List<CharacterClass> classList = characterClassRepository.findAll();
                    
                    if (!speciesList.isEmpty() && !backgroundList.isEmpty() && !classList.isEmpty()) {
                        Species debugSpecies = speciesList.get(0);
                        Background debugBackground = backgroundList.get(0);
                        CharacterClass debugClass = classList.get(0);
                        
                        Character debugCharacter = new Character();
                        debugCharacter.setName("Tom(Debug Character)");
                        debugCharacter.setSpecies(debugSpecies);
                        debugCharacter.setBackground(debugBackground);
                        debugCharacter.setCharacterClass(debugClass);
                        debugCharacter.setLevel(3);
                        debugCharacter.setTemporaryHp(0);
                        debugCharacter.setCurrentHp(25);
                        debugCharacter.setMaxHp(25);
                        debugCharacter.setSpeed(30);
                        debugCharacter.setStrength(16);
                        debugCharacter.setDexterity(14);
                        debugCharacter.setConstitution(15);
                        debugCharacter.setIntelligence(12);
                        debugCharacter.setWisdom(13);
                        debugCharacter.setCharisma(10);
                        
                        // Set some debug skills
                        String debugSkills = "[{\"name\":\"Athletics\",\"ability\":\"Strength\",\"proficiency\":\"proficient\",\"other\":0},{\"name\":\"Perception\",\"ability\":\"Wisdom\",\"proficiency\":\"proficient\",\"other\":0},{\"name\":\"Stealth\",\"ability\":\"Dexterity\",\"proficiency\":\"none\",\"other\":0}]";
                        debugCharacter.setSkills(debugSkills);
                        
                        // Set some debug inventory
                        String debugCoins = "{\"platinum\":0,\"gold\":150,\"electrum\":0,\"silver\":25,\"copper\":0}";
                        debugCharacter.setCoins(debugCoins);
                        
                        String debugItems = "[{\"id\":\"1\",\"name\":\"Longsword\",\"description\":\"A well-crafted longsword\",\"quantity\":1,\"weight\":3.0},{\"id\":\"2\",\"name\":\"Healing Potion\",\"description\":\"Restores 2d4+2 hit points\",\"quantity\":3,\"weight\":0.5}]";
                        debugCharacter.setItems(debugItems);
                        
                        Character savedDebugCharacter = characterRepository.save(debugCharacter);
                        logger.info("Created debug character with ID: {}", savedDebugCharacter.getId());
                    } else {
                        logger.warn("Cannot create debug character: missing species, background, or class data");
                    }
                } catch (Exception e) {
                    logger.error("Error creating debug character: {}", e.getMessage());
                }
            } else {
                logger.info("Characters already exist, skipping debug character creation");
            }
        } catch (Exception e) {
            logger.error("Error initializing data", e);
        }
    }

    @GetMapping("/characters")
    public List<Character> getAllCharacters() {
        return characterRepository.findAll();
    }

    @GetMapping("/species")
    public ResponseEntity<?> getAllSpecies() {
        try {
            logger.info("Fetching all species with traits...");
            List<Species> species = speciesRepository.findAllWithTraits();
            logger.info("Found {} species", species.size());
            return ResponseEntity.ok(species);
        } catch (Exception e) {
            logger.error("Error fetching species", e);
            return ResponseEntity.internalServerError().body("Error fetching species: " + e.getMessage());
        }
    }

    @GetMapping("/backgrounds")
    public ResponseEntity<?> getAllBackgrounds() {
        try {
            logger.info("Fetching all backgrounds with features...");
            List<Background> backgrounds = backgroundRepository.findAllWithFeatures();
            logger.info("Found {} backgrounds", backgrounds.size());
            return ResponseEntity.ok(backgrounds);
        } catch (Exception e) {
            logger.error("Error fetching backgrounds", e);
            return ResponseEntity.internalServerError().body("Error fetching backgrounds: " + e.getMessage());
        }
    }

    @GetMapping("/classes")
    public ResponseEntity<?> getAllClasses() {
        try {
            logger.info("Fetching all classes with features...");
            List<CharacterClass> classes = characterClassRepository.findAllWithFeatures();
            logger.info("Found {} classes", classes.size());
            return ResponseEntity.ok(classes);
        } catch (Exception e) {
            logger.error("Error fetching classes", e);
            return ResponseEntity.internalServerError().body("Error fetching classes: " + e.getMessage());
        }
    }

    @PostMapping("/characters")
    public ResponseEntity<?> createCharacter(@RequestBody Map<String, String> request) {
        try {
            logger.info("Received character creation request: {}", request);
            
            String name = request.get("name");
            String speciesId = request.get("speciesId");
            String backgroundId = request.get("backgroundId");
            String classId = request.get("classId");
            String strengthStr = request.get("strength");
            String dexterityStr = request.get("dexterity");
            String constitutionStr = request.get("constitution");
            String intelligenceStr = request.get("intelligence");
            String wisdomStr = request.get("wisdom");
            String charismaStr = request.get("charisma");

            // Check for null values
            if (name == null || name.trim().isEmpty()) {
                String message = "Character name cannot be empty";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            if (speciesId == null) {
                String message = "Species ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            if (backgroundId == null) {
                String message = "Background ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            if (classId == null) {
                String message = "Class ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            // Look up species, background, and class
            Species species = speciesRepository.findByIdWithTraits(UUID.fromString(speciesId));
            if (species == null) {
                String message = "Species not found with ID: " + speciesId;
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            Background background = backgroundRepository.findByIdWithFeatures(UUID.fromString(backgroundId));
            if (background == null) {
                String message = "Background not found with ID: " + backgroundId;
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            CharacterClass characterClass = characterClassRepository.findByIdWithFeatures(UUID.fromString(classId));
            if (characterClass == null) {
                String message = "Class not found with ID: " + classId;
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            // Create new character
            Character character = new Character();
            character.setName(name);
            character.setSpecies(species);
            character.setBackground(background);
            character.setCharacterClass(characterClass);

            // Handle ability scores
            if (strengthStr != null) {
                try {
                    int strength = Integer.parseInt(strengthStr);
                    if (strength < 0) {
                        String message = "Strength cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setStrength(strength);
                } catch (NumberFormatException e) {
                    String message = "Invalid strength format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (dexterityStr != null) {
                try {
                    int dexterity = Integer.parseInt(dexterityStr);
                    if (dexterity < 0) {
                        String message = "Dexterity cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setDexterity(dexterity);
                } catch (NumberFormatException e) {
                    String message = "Invalid dexterity format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (constitutionStr != null) {
                try {
                    int constitution = Integer.parseInt(constitutionStr);
                    if (constitution < 0) {
                        String message = "Constitution cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setConstitution(constitution);
                } catch (NumberFormatException e) {
                    String message = "Invalid constitution format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (intelligenceStr != null) {
                try {
                    int intelligence = Integer.parseInt(intelligenceStr);
                    if (intelligence < 0) {
                        String message = "Intelligence cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setIntelligence(intelligence);
                } catch (NumberFormatException e) {
                    String message = "Invalid intelligence format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (wisdomStr != null) {
                try {
                    int wisdom = Integer.parseInt(wisdomStr);
                    if (wisdom < 0) {
                        String message = "Wisdom cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setWisdom(wisdom);
                } catch (NumberFormatException e) {
                    String message = "Invalid wisdom format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (charismaStr != null) {
                try {
                    int charisma = Integer.parseInt(charismaStr);
                    if (charisma < 0) {
                        String message = "Charisma cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setCharisma(charisma);
                } catch (NumberFormatException e) {
                    String message = "Invalid charisma format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }
            
            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully created character: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (IllegalArgumentException e) {
            String message = "Invalid UUID format";
            logger.error(message, e);
            return ResponseEntity.badRequest().body(message);
        } catch (Exception e) {
            String message = "Error creating character: " + e.getMessage();
            logger.error(message, e);
            return ResponseEntity.internalServerError().body(message);
        }
    }

    @GetMapping("/characters/{id}")
    public ResponseEntity<Character> getCharacterById(@PathVariable Long id) {
        return characterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/characters/{id}")
    public ResponseEntity<?> updateCharacter(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String name = request.get("name");
            String speciesId = request.get("speciesId");
            String backgroundId = request.get("backgroundId");
            String classId = request.get("classId");
            String levelStr = request.get("level");
            String tempHpStr = request.get("temporaryHp");
            String currentHpStr = request.get("currentHp");
            String maxHpStr = request.get("maxHp");
            String speedStr = request.get("speed");
            String strengthStr = request.get("strength");
            String dexterityStr = request.get("dexterity");
            String constitutionStr = request.get("constitution");
            String intelligenceStr = request.get("intelligence");
            String wisdomStr = request.get("wisdom");
            String charismaStr = request.get("charisma");
            String coins = request.get("coins");
            String items = request.get("items");
            String details = request.get("details");

            if (name == null || name.trim().isEmpty()) {
                String message = "Character name cannot be empty";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            if (speciesId == null) {
                String message = "Species ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            if (backgroundId == null) {
                String message = "Background ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            if (classId == null) {
                String message = "Class ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            // Handle inventory updates
            if (coins != null) {
                character.setCoins(coins);
                logger.info("Updating character coins to: {}", coins);
            }

            if (items != null) {
                character.setItems(items);
                logger.info("Updating character items to: {}", items);
            }

            // Handle details updates
            if (details != null) {
                character.setDetails(details);
                logger.info("Updating character details to: {}", details);
            }

            // Handle level update
            if (levelStr != null) {
                try {
                    int level = Integer.parseInt(levelStr);
                    if (level < 1 || level > 20) {
                        String message = "Level must be between 1 and 20";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setLevel(level);
                    logger.info("Updating character level to: {}", level);
                } catch (NumberFormatException e) {
                    String message = "Invalid level format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            // Handle HP and speed updates
            if (tempHpStr != null) {
                try {
                    int tempHp = Integer.parseInt(tempHpStr);
                    if (tempHp < 0) {
                        String message = "Temporary HP cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setTemporaryHp(tempHp);
                    logger.info("Updating character temporary HP to: {}", tempHp);
                } catch (NumberFormatException e) {
                    String message = "Invalid temporary HP format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (currentHpStr != null) {
                try {
                    int currentHp = Integer.parseInt(currentHpStr);
                    if (currentHp < 0) {
                        String message = "Current HP cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setCurrentHp(currentHp);
                    logger.info("Updating character current HP to: {}", currentHp);
                } catch (NumberFormatException e) {
                    String message = "Invalid current HP format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (maxHpStr != null) {
                try {
                    int maxHp = Integer.parseInt(maxHpStr);
                    if (maxHp < 0) {
                        String message = "Maximum HP cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setMaxHp(maxHp);
                    logger.info("Updating character maximum HP to: {}", maxHp);
                } catch (NumberFormatException e) {
                    String message = "Invalid maximum HP format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (speedStr != null) {
                try {
                    int speed = Integer.parseInt(speedStr);
                    if (speed < 0) {
                        String message = "Speed cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setSpeed(speed);
                    logger.info("Updating character speed to: {}", speed);
                } catch (NumberFormatException e) {
                    String message = "Invalid speed format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            // Handle ability score updates
            if (strengthStr != null) {
                try {
                    int strength = Integer.parseInt(strengthStr);
                    if (strength < 0) {
                        String message = "Strength cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setStrength(strength);
                } catch (NumberFormatException e) {
                    String message = "Invalid strength format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (dexterityStr != null) {
                try {
                    int dexterity = Integer.parseInt(dexterityStr);
                    if (dexterity < 0) {
                        String message = "Dexterity cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setDexterity(dexterity);
                } catch (NumberFormatException e) {
                    String message = "Invalid dexterity format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (constitutionStr != null) {
                try {
                    int constitution = Integer.parseInt(constitutionStr);
                    if (constitution < 0) {
                        String message = "Constitution cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setConstitution(constitution);
                } catch (NumberFormatException e) {
                    String message = "Invalid constitution format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (intelligenceStr != null) {
                try {
                    int intelligence = Integer.parseInt(intelligenceStr);
                    if (intelligence < 0) {
                        String message = "Intelligence cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setIntelligence(intelligence);
                } catch (NumberFormatException e) {
                    String message = "Invalid intelligence format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (wisdomStr != null) {
                try {
                    int wisdom = Integer.parseInt(wisdomStr);
                    if (wisdom < 0) {
                        String message = "Wisdom cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setWisdom(wisdom);
                } catch (NumberFormatException e) {
                    String message = "Invalid wisdom format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            if (charismaStr != null) {
                try {
                    int charisma = Integer.parseInt(charismaStr);
                    if (charisma < 0) {
                        String message = "Charisma cannot be negative";
                        logger.error(message);
                        return ResponseEntity.badRequest().body(message);
                    }
                    character.setCharisma(charisma);
                } catch (NumberFormatException e) {
                    String message = "Invalid charisma format";
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            Species species = speciesRepository.findByIdWithTraits(UUID.fromString(speciesId));
            if (species == null) {
                String message = "Species not found with ID: " + speciesId;
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            Background background = backgroundRepository.findByIdWithFeatures(UUID.fromString(backgroundId));
            if (background == null) {
                String message = "Background not found with ID: " + backgroundId;
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            CharacterClass characterClass = characterClassRepository.findByIdWithFeatures(UUID.fromString(classId));
            if (characterClass == null) {
                String message = "Class not found with ID: " + classId;
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            character.setName(name);
            character.setSpecies(species);
            character.setBackground(background);
            character.setCharacterClass(characterClass);

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (IllegalArgumentException e) {
            String message = "Invalid UUID format";
            logger.error(message, e);
            return ResponseEntity.badRequest().body(message);
        } catch (Exception e) {
            logger.error("Error updating character", e);
            return ResponseEntity.internalServerError().body("Error updating character: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/inventory")
    public ResponseEntity<?> updateCharacterInventory(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String coins = request.get("coins");
            String items = request.get("items");

            if (coins != null) {
                character.setCoins(coins);
                logger.info("Updating character coins to: {}", coins);
            }

            if (items != null) {
                character.setItems(items);
                logger.info("Updating character items to: {}", items);
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character inventory: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character inventory", e);
            return ResponseEntity.internalServerError().body("Error updating character inventory: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/details")
    public ResponseEntity<?> updateCharacterDetails(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String details = request.get("details");

            if (details != null) {
                character.setDetails(details);
                logger.info("Updating character details to: {}", details);
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character details: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character details", e);
            return ResponseEntity.internalServerError().body("Error updating character details: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/skills")
    public ResponseEntity<?> updateCharacterSkills(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String skills = request.get("skills");

            if (skills != null) {
                try {
                    logger.info("Received skills data: {}", skills);
                    
                    // Validate that skills is valid JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.readTree(skills); // This will throw an exception if invalid JSON
                    
                    character.setSkills(skills);
                    logger.info("Successfully updated character skills");
                } catch (Exception e) {
                    String message = "Invalid skills JSON format: " + e.getMessage();
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character skills: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character skills", e);
            return ResponseEntity.internalServerError().body("Error updating character skills: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/class-actions")
    public ResponseEntity<?> updateCharacterClassActions(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String classActions = request.get("classActions");

            if (classActions != null) {
                try {
                    logger.info("Received class actions data: {}", classActions);
                    
                    // Validate that classActions is valid JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.readTree(classActions); // This will throw an exception if invalid JSON
                    
                    character.setClassActions(classActions);
                    logger.info("Successfully updated character class actions");
                    
                } catch (Exception e) {
                    String message = "Invalid class actions JSON format: " + e.getMessage();
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character class actions: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character class actions", e);
            return ResponseEntity.internalServerError().body("Error updating character class actions: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/spell-slots")
    public ResponseEntity<?> updateCharacterSpellSlots(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String spellSlots = request.get("spellSlots");

            if (spellSlots != null) {
                try {
                    logger.info("Received spell slots data: {}", spellSlots);
                    
                    // Validate that spellSlots is valid JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.readTree(spellSlots); // This will throw an exception if invalid JSON
                    
                    character.setSpellSlots(spellSlots);
                    logger.info("Successfully updated character spell slots");
                    
                } catch (Exception e) {
                    String message = "Invalid spell slots JSON format: " + e.getMessage();
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character spell slots: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character spell slots", e);
            return ResponseEntity.internalServerError().body("Error updating character spell slots: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/spells")
    public ResponseEntity<?> updateCharacterSpells(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String spells = request.get("spells");

            if (spells != null) {
                try {
                    logger.info("Received spells data: {}", spells);
                    
                    // Validate that spells is valid JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.readTree(spells); // This will throw an exception if invalid JSON
                    
                    character.setSpells(spells);
                    logger.info("Successfully updated character spells");
                    
                } catch (Exception e) {
                    String message = "Invalid spells JSON format: " + e.getMessage();
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character spells: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character spells", e);
            return ResponseEntity.internalServerError().body("Error updating character spells: " + e.getMessage());
        }
    }

    @PutMapping("/characters/{id}/weapons")
    public ResponseEntity<?> updateCharacterWeapons(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            String weapons = request.get("weapons");

            if (weapons != null) {
                try {
                    logger.info("Received weapons data: {}", weapons);
                    
                    // Validate that weapons is valid JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.readTree(weapons); // This will throw an exception if invalid JSON
                    
                    character.setWeapons(weapons);
                    logger.info("Successfully updated character weapons");
                    
                } catch (Exception e) {
                    String message = "Invalid weapons JSON format: " + e.getMessage();
                    logger.error(message, e);
                    return ResponseEntity.badRequest().body(message);
                }
            }

            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully updated character weapons: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (Exception e) {
            logger.error("Error updating character weapons", e);
            return ResponseEntity.internalServerError().body("Error updating character weapons: " + e.getMessage());
        }
    }

    @DeleteMapping("/characters/{id}")
    public ResponseEntity<?> deleteCharacter(@PathVariable Long id) {
        try {
            Character character = characterRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Character not found"));

            characterRepository.delete(character);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting character", e);
            return ResponseEntity.internalServerError().body("Error deleting character: " + e.getMessage());
        }
    }

    @PostMapping("/debug/character")
    public ResponseEntity<?> createDebugCharacter() {
        try {
            logger.info("Creating debug character on demand...");
            
            // Get the first available species, background, and class
            List<Species> speciesList = speciesRepository.findAll();
            List<Background> backgroundList = backgroundRepository.findAll();
            List<CharacterClass> classList = characterClassRepository.findAll();
            
            if (speciesList.isEmpty() || backgroundList.isEmpty() || classList.isEmpty()) {
                String message = "Cannot create debug character: missing species, background, or class data";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }
            
            Species debugSpecies = speciesList.get(0);
            Background debugBackground = backgroundList.get(0);
            CharacterClass debugClass = classList.get(0);
            
            Character debugCharacter = new Character();
            debugCharacter.setName("Debug Character " + System.currentTimeMillis());
            debugCharacter.setSpecies(debugSpecies);
            debugCharacter.setBackground(debugBackground);
            debugCharacter.setCharacterClass(debugClass);
            debugCharacter.setLevel(3);
            debugCharacter.setTemporaryHp(0);
            debugCharacter.setCurrentHp(25);
            debugCharacter.setMaxHp(25);
            debugCharacter.setSpeed(30);
            debugCharacter.setStrength(16);
            debugCharacter.setDexterity(14);
            debugCharacter.setConstitution(15);
            debugCharacter.setIntelligence(12);
            debugCharacter.setWisdom(13);
            debugCharacter.setCharisma(10);
            
            // Set some debug skills
            String debugSkills = "[{\"name\":\"Athletics\",\"ability\":\"Strength\",\"proficiency\":\"proficient\",\"other\":0},{\"name\":\"Perception\",\"ability\":\"Wisdom\",\"proficiency\":\"proficient\",\"other\":0},{\"name\":\"Stealth\",\"ability\":\"Dexterity\",\"proficiency\":\"none\",\"other\":0}]";
            debugCharacter.setSkills(debugSkills);
            
            // Set some debug inventory
            String debugCoins = "{\"platinum\":0,\"gold\":150,\"electrum\":0,\"silver\":25,\"copper\":0}";
            debugCharacter.setCoins(debugCoins);
            
            String debugItems = "[{\"id\":\"1\",\"name\":\"Longsword\",\"description\":\"A well-crafted longsword\",\"quantity\":1,\"weight\":3.0},{\"id\":\"2\",\"name\":\"Healing Potion\",\"description\":\"Restores 2d4+2 hit points\",\"quantity\":3,\"weight\":0.5}]";
            debugCharacter.setItems(debugItems);
            
            Character savedDebugCharacter = characterRepository.save(debugCharacter);
            logger.info("Created debug character with ID: {}", savedDebugCharacter.getId());
            
            return ResponseEntity.ok(savedDebugCharacter);
        } catch (Exception e) {
            logger.error("Error creating debug character", e);
            return ResponseEntity.internalServerError().body("Error creating debug character: " + e.getMessage());
        }
    }
} 