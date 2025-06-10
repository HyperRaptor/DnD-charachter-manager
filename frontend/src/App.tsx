import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CharacterCreate from './components/CharacterCreate';
import CharacterDelete from './components/CharacterDelete';
import CharacterDetails from './components/CharacterDetails';
import CharacterList from './components/CharacterList';
import { Character, Species, Background, CharacterClass, Skill } from './types/character';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSpecies, setEditSpecies] = useState<Species | null>(null);
  const [editBackground, setEditBackground] = useState<Background | null>(null);
  const [editClass, setEditClass] = useState<CharacterClass | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [backgroundList, setBackgroundList] = useState<Background[]>([]);
  const [classList, setClassList] = useState<CharacterClass[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const initializeData = async () => {
      console.log('Starting data initialization...');
      setError(null);
      try {
        // Fetch species
        console.log('Fetching species from:', `${apiUrl}/api/species`);
        const speciesResponse = await axios.get(`${apiUrl}/api/species`);
        console.log('Species response:', speciesResponse.data);
        console.log('Species response type:', typeof speciesResponse.data);
        console.log('Species response is array:', Array.isArray(speciesResponse.data));
        
        if (!speciesResponse.data || speciesResponse.data.length === 0) {
          console.warn('No species data received');
          setError('No species available. Please check if the backend is properly initialized.');
          return;
        }
        
        setSpeciesList(speciesResponse.data);
        setEditSpecies(speciesResponse.data[0]);

        // Fetch backgrounds
        console.log('Fetching backgrounds from:', `${apiUrl}/api/backgrounds`);
        const backgroundsResponse = await axios.get(`${apiUrl}/api/backgrounds`);
        console.log('Backgrounds response:', backgroundsResponse.data);
        console.log('Backgrounds response type:', typeof backgroundsResponse.data);
        console.log('Backgrounds response is array:', Array.isArray(backgroundsResponse.data));
        console.log('Backgrounds list length:', backgroundsResponse.data?.length);
        
        if (!backgroundsResponse.data || backgroundsResponse.data.length === 0) {
          console.warn('No backgrounds data received');
          setError('No backgrounds available. Please check if the backend is properly initialized.');
          return;
        }
        
        setBackgroundList(backgroundsResponse.data);
        setEditBackground(backgroundsResponse.data[0]);

        // Fetch classes
        console.log('Fetching classes from:', `${apiUrl}/api/classes`);
        const classesResponse = await axios.get(`${apiUrl}/api/classes`);
        console.log('Classes response:', classesResponse.data);
        console.log('Classes response type:', typeof classesResponse.data);
        console.log('Classes response is array:', Array.isArray(classesResponse.data));
        console.log('Classes list length:', classesResponse.data?.length);
        
        if (!classesResponse.data || classesResponse.data.length === 0) {
          console.warn('No classes data received');
          setError('No classes available. Please check if the backend is properly initialized.');
          return;
        }
        
        setClassList(classesResponse.data);
        setEditClass(classesResponse.data[0]);

        // Fetch characters
        console.log('Fetching characters...');
        const charactersResponse = await axios.get(`${apiUrl}/api/characters`);
        console.log('Characters response:', charactersResponse.data);
        setCharacters(charactersResponse.data);
      } catch (error) {
        console.error('Error during initialization:', error);
        if (axios.isAxiosError(error)) {
          console.error('API Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
          });
          setError(`Error fetching data: ${error.response?.data || error.message}`);
        }
      }
    };

    console.log('UseEffect triggered with apiUrl:', apiUrl);
    initializeData();
  }, []);

  const initializeEditState = (character: Character) => {
    setEditName(character.name);
    setEditSpecies(character.species);
    setEditBackground(character.background);
    setEditClass(character.characterClass);
  };

  const handleCharacterCreated = (character: Character) => {
    setCharacters([...characters, character]);
    setShowCreateModal(false);
  };

  const handleCharacterDeleted = (characterId: number) => {
    setCharacters(characters.filter(char => char.id !== characterId));
    if (selectedCharacter?.id === characterId) {
      setSelectedCharacter(null);
    }
  };

  const handleLevelChange = async (newLevel: number) => {
    console.log('handleLevelChange called with newLevel:', newLevel);
    console.log('Current character level:', selectedCharacter?.level);
    
    if (!selectedCharacter) {
      console.log('No character selected, returning');
      return;
    }
    
    if (newLevel < 1 || newLevel > 20) {
      console.log('Invalid level:', newLevel);
      alert("Level must be between 1 and 20");
      return;
    }

    try {
      const characterData = {
        name: selectedCharacter.name,
        speciesId: selectedCharacter.species.id,
        backgroundId: selectedCharacter.background.id,
        classId: selectedCharacter.characterClass.id,
        level: newLevel
      };
      
      console.log('Sending level update data:', characterData);
      console.log('Current character state:', selectedCharacter);
      
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}`, characterData);
      console.log('Level update response:', response.data);
      
      // Verify the response data
      if (response.data.level !== newLevel) {
        console.warn('Response level does not match requested level:', {
          requested: newLevel,
          received: response.data.level
        });
      }
      
      const updatedCharacters = characters.map(char => 
        char.id === selectedCharacter.id ? response.data : char
      );
      setCharacters(updatedCharacters);
      setSelectedCharacter(response.data);
    } catch (error) {
      console.error('Error updating character level:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data, null, 2);
        alert(`Error updating character level: ${errorMessage}`);
      } else {
        alert('Error updating character level. Please try again.');
      }
    }
  };

  const handleHpChange = async (field: 'temporaryHp' | 'currentHp' | 'maxHp', value: number) => {
    if (!selectedCharacter) return;
    
    if (value < 0) {
      alert("HP values cannot be negative");
      return;
    }

    try {
      const characterData = {
        name: selectedCharacter.name,
        speciesId: selectedCharacter.species.id,
        backgroundId: selectedCharacter.background.id,
        classId: selectedCharacter.characterClass.id,
        level: selectedCharacter.level,
        [field]: value
      };
      
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}`, characterData);
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? response.data : char
      ));
      setSelectedCharacter(response.data);
    } catch (error) {
      console.error('Error updating HP:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error updating HP: ${error.response.data}`);
      } else {
        alert('Error updating HP. Please try again.');
      }
    }
  };

  const handleSpeedChange = async (value: number) => {
    if (!selectedCharacter) return;
    
    if (value < 0) {
      alert("Speed cannot be negative");
      return;
    }

    try {
      const characterData = {
        name: selectedCharacter.name,
        speciesId: selectedCharacter.species.id,
        backgroundId: selectedCharacter.background.id,
        classId: selectedCharacter.characterClass.id,
        level: selectedCharacter.level,
        speed: value
      };
      
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}`, characterData);
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? response.data : char
      ));
      setSelectedCharacter(response.data);
    } catch (error) {
      console.error('Error updating speed:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error updating speed: ${error.response.data}`);
      } else {
        alert('Error updating speed. Please try again.');
      }
    }
  };

  const handleAbilityScoreChange = async (ability: string, value: number) => {
    if (!selectedCharacter) return;
    
    if (value < 0) {
      alert("Ability scores cannot be negative");
      return;
    }

    try {
      const characterData = {
        name: selectedCharacter.name,
        speciesId: selectedCharacter.species.id,
        backgroundId: selectedCharacter.background.id,
        classId: selectedCharacter.characterClass.id,
        level: selectedCharacter.level,
        [ability]: value
      };
      
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}`, characterData);
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? response.data : char
      ));
      setSelectedCharacter(response.data);
    } catch (error) {
      console.error('Error updating ability score:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error updating ability score: ${error.response.data}`);
      } else {
        alert('Error updating ability score. Please try again.');
      }
    }
  };

  const handleSkillChange = async (skillName: string, field: 'proficiency' | 'other', value: string | number) => {
    if (!selectedCharacter) return;

    try {
      // Get current skills or initialize empty array
      let currentSkills: Skill[] = [];
      if (selectedCharacter.skills) {
        try {
          currentSkills = typeof selectedCharacter.skills === 'string' 
            ? JSON.parse(selectedCharacter.skills) 
            : selectedCharacter.skills;
        } catch (e) {
          console.error('Error parsing skills:', e);
          currentSkills = [];
        }
      }
      
      // Find existing skill or create new one
      let updatedSkills = [...currentSkills];
      const existingSkillIndex = updatedSkills.findIndex(s => s.name === skillName);
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        updatedSkills[existingSkillIndex] = {
          ...updatedSkills[existingSkillIndex],
          [field]: value
        };
      } else {
        // Create new skill
        const skillGroups = [
          { ability: 'Strength', skills: ['Athletics'] },
          { ability: 'Dexterity', skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'] },
          { ability: 'Intelligence', skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'] },
          { ability: 'Wisdom', skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'] },
          { ability: 'Charisma', skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'] }
        ];
        
        const group = skillGroups.find(g => g.skills.includes(skillName));
        const newSkill: Skill = {
          name: skillName,
          ability: group?.ability || '',
          proficiency: field === 'proficiency' ? (value as 'none' | 'proficient' | 'expertise' | 'jack-of-all-trades') : 'none',
          other: field === 'other' ? value as number : 0
        };
        updatedSkills.push(newSkill);
      }

      const characterData = {
        skills: JSON.stringify(updatedSkills)
      };
      
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}/skills`, characterData);
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? response.data : char
      ));
      setSelectedCharacter(response.data);
    } catch (error) {
      console.error('Error updating skill:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error updating skill: ${error.response.data}`);
      } else {
        alert('Error updating skill. Please try again.');
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation();
    setCharacterToDelete(character);
    setShowDeleteModal(true);
  };

  const handleUpdateCharacter = async () => {
    if (!selectedCharacter || !editSpecies || !editBackground || !editClass) return;
    try {
      const characterData = {
        name: editName,
        speciesId: editSpecies.id,
        backgroundId: editBackground.id,
        classId: editClass.id,
        level: selectedCharacter.level // Keep current level
      };
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}`, characterData);
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? response.data : char
      ));
      setSelectedCharacter(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating character:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data, null, 2);
        alert(`Error updating character: ${errorMessage}`);
      } else {
        alert('Error updating character. Please try again.');
      }
    }
  };

  const handleStartEditing = () => {
    if (selectedCharacter) {
      initializeEditState(selectedCharacter);
      setIsEditing(true);
    }
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setIsEditing(false);
    initializeEditState(character);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateDebug = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/debug/character`);
      const newCharacter = response.data;
      setCharacters([...characters, newCharacter]);
      alert(`Debug character "${newCharacter.name}" created successfully!`);
    } catch (error) {
      console.error('Error creating debug character:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error creating debug character: ${error.response.data}`);
      } else {
        alert('Error creating debug character. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Character List - Only show when no character is selected and not creating */}
      {!selectedCharacter && !showCreateModal && (
        <CharacterList
          characters={characters}
          onCharacterSelect={handleCharacterSelect}
          onCharacterDelete={handleDeleteClick}
          onCreateNew={handleCreateNew}
          onCreateDebug={handleCreateDebug}
        />
      )}

      {/* Create Character Modal - Using the new component */}
      {showCreateModal && (
        <CharacterCreate
          onClose={() => setShowCreateModal(false)}
          onCharacterCreated={handleCharacterCreated}
          apiUrl={apiUrl}
        />
      )}

      {/* Character Details - Using the new component */}
      {selectedCharacter && !showCreateModal && (
        <CharacterDetails
          character={selectedCharacter}
          onBack={() => {
            setSelectedCharacter(null);
            setIsEditing(false);
          }}
          onDelete={handleDeleteClick}
          onLevelChange={handleLevelChange}
          onHpChange={handleHpChange}
          onSpeedChange={handleSpeedChange}
          onAbilityScoreChange={handleAbilityScoreChange}
          onSkillChange={handleSkillChange}
          speciesList={speciesList}
          backgroundList={backgroundList}
          classList={classList}
          editName={editName}
          setEditName={setEditName}
          editSpecies={editSpecies}
          setEditSpecies={setEditSpecies}
          editBackground={editBackground}
          setEditBackground={setEditBackground}
          editClass={editClass}
          setEditClass={setEditClass}
          isEditing={isEditing}
          setIsEditing={handleStartEditing}
          onSave={handleUpdateCharacter}
          apiUrl={apiUrl}
          onCharacterUpdated={(updatedCharacter) => {
            setCharacters(characters.map(char => 
              char.id === updatedCharacter.id ? updatedCharacter : char
            ));
            setSelectedCharacter(updatedCharacter);
          }}
        />
      )}

      {/* Delete Confirmation Modal - Using the new component */}
      <CharacterDelete
        character={characterToDelete}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCharacterToDelete(null);
        }}
        onCharacterDeleted={handleCharacterDeleted}
        apiUrl={apiUrl}
      />
    </div>
  );
}

export default App; 