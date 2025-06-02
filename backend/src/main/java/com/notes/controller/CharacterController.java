package com.notes.controller;

import com.notes.model.Character;
import com.notes.model.Species;
import com.notes.repository.CharacterRepository;
import com.notes.repository.SpeciesRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CharacterController {
    private static final Logger logger = LoggerFactory.getLogger(CharacterController.class);

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private SpeciesRepository speciesRepository;

    @PostConstruct
    public void init() {
        try {
            // Initialize species if they don't exist
            if (speciesRepository.count() == 0) {
                logger.info("Initializing species data...");

                Species human = new Species();
                human.setName("HUMAN");
                human.setTraits(Arrays.asList("Adaptable", "Resourceful", "Ambitious"));
                Species savedHuman = speciesRepository.save(human);
                logger.info("Created HUMAN species with ID: {}", savedHuman.getId());

                Species elf = new Species();
                elf.setName("ELF");
                elf.setTraits(Arrays.asList("Long-lived", "Keen Senses", "Graceful"));
                Species savedElf = speciesRepository.save(elf);
                logger.info("Created ELF species with ID: {}", savedElf.getId());

                logger.info("Species initialization complete");
            } else {
                logger.info("Species already exist, skipping initialization");
            }
        } catch (Exception e) {
            logger.error("Error initializing species", e);
        }
    }

    @GetMapping("/characters")
    public List<Character> getAllCharacters() {
        return characterRepository.findAll();
    }

    @GetMapping("/species")
    public List<Species> getAllSpecies() {
        return speciesRepository.findAll();
    }

    @PostMapping("/characters")
    public ResponseEntity<?> createCharacter(@RequestBody Map<String, String> request) {
        try {
            logger.info("Received character creation request: {}", request);
            
            String name = request.get("name");
            String speciesId = request.get("speciesId");

            // Check for null character name
            if (name == null || name.trim().isEmpty()) {
                String message = "Character name cannot be empty";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            // Check for null species ID
            if (speciesId == null) {
                String message = "Species ID cannot be null";
                logger.error(message);
                return ResponseEntity.badRequest().body(message);
            }

            // Look up species by UUID
            Species species = speciesRepository.findById(UUID.fromString(speciesId))
                    .orElseThrow(() -> {
                        String message = "Species not found with ID: " + speciesId;
                        logger.error(message);
                        return new RuntimeException(message);
                    });

            // Create new character
            Character character = new Character();
            character.setName(name);
            character.setSpecies(species);
            
            Character savedCharacter = characterRepository.save(character);
            logger.info("Successfully created character: {}", savedCharacter);
            return ResponseEntity.ok(savedCharacter);
        } catch (IllegalArgumentException e) {
            String message = "Invalid species ID format";
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

            Species species = speciesRepository.findById(UUID.fromString(speciesId))
                    .orElseThrow(() -> new RuntimeException("Species not found with ID: " + speciesId));

            character.setName(name);
            character.setSpecies(species);

            return ResponseEntity.ok(characterRepository.save(character));
        } catch (IllegalArgumentException e) {
            String message = "Invalid species ID format";
            logger.error(message, e);
            return ResponseEntity.badRequest().body(message);
        } catch (Exception e) {
            logger.error("Error updating character", e);
            return ResponseEntity.internalServerError().body("Error updating character: " + e.getMessage());
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
} 