import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaPlus, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import CharacterCreate from './components/CharacterCreate';
import { Character, Species, Background, CharacterClass } from './types/character';

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

  const handleCharacterCreated = (character: Character) => {
    setCharacters([...characters, character]);
    setShowCreateModal(false);
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

  const handleDeleteClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation();
    setCharacterToDelete(character);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!characterToDelete) return;
    try {
      await axios.delete(`${apiUrl}/api/characters/${characterToDelete.id}`);
      setCharacters(characters.filter(char => char.id !== characterToDelete.id));
      if (selectedCharacter?.id === characterToDelete.id) {
        setSelectedCharacter(null);
      }
      setShowDeleteModal(false);
      setCharacterToDelete(null);
    } catch (error) {
      console.error('Error deleting character:', error);
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
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Characters</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <FaPlus />
              </button>
            </div>
            <div className="space-y-2">
              {characters.map(character => (
                <div
                  key={character.id}
                  className="p-3 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCharacter(character);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{character.name}</h3>
                    <button
                      onClick={(e) => handleDeleteClick(e, character)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {character.species.name} {character.characterClass.name} {character.level}
                  </p>
                  <p className="text-xs text-gray-400">
                    {character.background.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Character Modal - Using the new component */}
      {showCreateModal && (
        <CharacterCreate
          onClose={() => setShowCreateModal(false)}
          onCharacterCreated={handleCharacterCreated}
          apiUrl={apiUrl}
        />
      )}

      {/* Character Details - Full Page */}
      {selectedCharacter && !showCreateModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setSelectedCharacter(null);
                    setIsEditing(false);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <FaArrowLeft className="text-2xl" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Character Details</h2>
              </div>
              <div className="flex items-center space-x-4">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit className="text-2xl" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteClick(e, selectedCharacter)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash className="text-2xl" />
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold w-full border-b-2 border-blue-500 focus:outline-none"
                    placeholder="Character Name"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Species Selection */}
                    <div>
                      <label className="font-medium">Species:</label>
                      <select
                        value={editSpecies?.id || ''}
                        onChange={(e) => {
                          const selected = speciesList.find(s => s.id === e.target.value);
                          if (selected) setEditSpecies(selected);
                        }}
                        className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        {speciesList.map(species => (
                          <option key={species.id} value={species.id}>
                            {species.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Background Selection */}
                    <div>
                      <label className="font-medium">Background:</label>
                      <select
                        value={editBackground?.id || ''}
                        onChange={(e) => {
                          const selected = backgroundList.find(b => b.id === e.target.value);
                          if (selected) setEditBackground(selected);
                        }}
                        className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        {backgroundList.map(background => (
                          <option key={background.id} value={background.id}>
                            {background.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Class Selection */}
                    <div>
                      <label className="font-medium">Class:</label>
                      <select
                        value={editClass?.id || ''}
                        onChange={(e) => {
                          const selected = classList.find(c => c.id === e.target.value);
                          if (selected) setEditClass(selected);
                        }}
                        className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
                      >
                        {classList.map(characterClass => (
                          <option key={characterClass.id} value={characterClass.id}>
                            {characterClass.name} (Hit Die: {characterClass.hitDie})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{selectedCharacter.name}</h1>
                    <div className="flex items-center space-x-4">
                      <label className="font-medium">Level:</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            console.log('Decrease level clicked. Current level:', selectedCharacter.level);
                            handleLevelChange(selectedCharacter.level - 1);
                          }}
                          disabled={selectedCharacter.level <= 1}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{selectedCharacter.level}</span>
                        <button
                          onClick={() => {
                            console.log('Increase level clicked. Current level:', selectedCharacter.level);
                            handleLevelChange(selectedCharacter.level + 1);
                          }}
                          disabled={selectedCharacter.level >= 20}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-semibold">Species</h3>
                      <p>{selectedCharacter.species.name}</p>
                      <div className="mt-2 space-y-1">
                        {selectedCharacter.species.traits.map(trait => (
                          <div key={trait.id} className="text-sm text-gray-600">
                            <span className="font-medium">{trait.title}:</span> {trait.description}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold">Background</h3>
                      <p>{selectedCharacter.background.name}</p>
                      <div className="mt-2 space-y-1">
                        {selectedCharacter.background.features.map(feature => (
                          <div key={feature.id} className="text-sm text-gray-600">
                            <span className="font-medium">{feature.title}:</span> {feature.description}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold">Class</h3>
                      <p>{selectedCharacter.characterClass.name} (Level {selectedCharacter.level})</p>
                      <p className="text-sm text-gray-500">Hit Die: {selectedCharacter.characterClass.hitDie}</p>
                      
                      {/* HP and Speed Section */}
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* HP Controls */}
                          <div className="space-y-2">
                            <h4 className="font-medium">Hit Points</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm">Temporary HP:</label>
                                <input
                                  type="number"
                                  value={selectedCharacter.temporaryHp}
                                  onChange={(e) => handleHpChange('temporaryHp', parseInt(e.target.value) || 0)}
                                  className="w-14 p-1 text-center border rounded"
                                  min="0"
                                  max="999"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm">Current HP:</label>
                                  <input
                                    type="number"
                                    value={selectedCharacter.currentHp}
                                    onChange={(e) => handleHpChange('currentHp', parseInt(e.target.value) || 0)}
                                    className="w-14 p-1 text-center border rounded"
                                    min="0"
                                    max="999"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <label className="text-sm">Max HP:</label>
                                  <input
                                    type="number"
                                    value={selectedCharacter.maxHp}
                                    onChange={(e) => handleHpChange('maxHp', parseInt(e.target.value) || 0)}
                                    className="w-14 p-1 text-center border rounded"
                                    min="0"
                                    max="999"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Speed Control */}
                          <div className="space-y-2">
                            <h4 className="font-medium">Speed</h4>
                            <div className="flex items-center justify-between">
                              <label className="text-sm">Movement Speed:</label>
                              <input
                                type="number"
                                value={selectedCharacter.speed}
                                onChange={(e) => handleSpeedChange(parseInt(e.target.value) || 0)}
                                className="w-14 p-1 text-center border rounded"
                                min="0"
                                max="999"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ability Scores Section */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Ability Scores</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm">STR:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={selectedCharacter.strength}
                                onChange={(e) => handleAbilityScoreChange('strength', parseInt(e.target.value) || 0)}
                                className="w-12 p-1 text-center border rounded"
                                min="0"
                                max="99"
                              />
                              <span className={`w-8 text-center ${selectedCharacter.strengthModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCharacter.strengthModifier >= 0 ? '+' : ''}{selectedCharacter.strengthModifier}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm">DEX:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={selectedCharacter.dexterity}
                                onChange={(e) => handleAbilityScoreChange('dexterity', parseInt(e.target.value) || 0)}
                                className="w-12 p-1 text-center border rounded"
                                min="0"
                                max="99"
                              />
                              <span className={`w-8 text-center ${selectedCharacter.dexterityModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCharacter.dexterityModifier >= 0 ? '+' : ''}{selectedCharacter.dexterityModifier}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm">CON:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={selectedCharacter.constitution}
                                onChange={(e) => handleAbilityScoreChange('constitution', parseInt(e.target.value) || 0)}
                                className="w-12 p-1 text-center border rounded"
                                min="0"
                                max="99"
                              />
                              <span className={`w-8 text-center ${selectedCharacter.constitutionModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCharacter.constitutionModifier >= 0 ? '+' : ''}{selectedCharacter.constitutionModifier}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm">INT:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={selectedCharacter.intelligence}
                                onChange={(e) => handleAbilityScoreChange('intelligence', parseInt(e.target.value) || 0)}
                                className="w-12 p-1 text-center border rounded"
                                min="0"
                                max="99"
                              />
                              <span className={`w-8 text-center ${selectedCharacter.intelligenceModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCharacter.intelligenceModifier >= 0 ? '+' : ''}{selectedCharacter.intelligenceModifier}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm">WIS:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={selectedCharacter.wisdom}
                                onChange={(e) => handleAbilityScoreChange('wisdom', parseInt(e.target.value) || 0)}
                                className="w-12 p-1 text-center border rounded"
                                min="0"
                                max="99"
                              />
                              <span className={`w-8 text-center ${selectedCharacter.wisdomModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCharacter.wisdomModifier >= 0 ? '+' : ''}{selectedCharacter.wisdomModifier}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm">CHA:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={selectedCharacter.charisma}
                                onChange={(e) => handleAbilityScoreChange('charisma', parseInt(e.target.value) || 0)}
                                className="w-12 p-1 text-center border rounded"
                                min="0"
                                max="99"
                              />
                              <span className={`w-8 text-center ${selectedCharacter.charismaModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedCharacter.charismaModifier >= 0 ? '+' : ''}{selectedCharacter.charismaModifier}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Class Features */}
                      <div className="mt-4 space-y-1">
                        {selectedCharacter.characterClass.features
                          .filter(feature => feature.level <= selectedCharacter.level)
                          .sort((a, b) => a.level - b.level)
                          .map(feature => (
                            <div key={feature.id} className="text-sm text-gray-600">
                              <span className="font-medium">Level {feature.level} - {feature.title}:</span> {feature.description}
                            </div>
                          ))}
                        {selectedCharacter.characterClass.features.some(feature => feature.level > selectedCharacter.level) && (
                          <div className="mt-2 text-sm text-gray-500 italic">
                            {selectedCharacter.level < 20 ? (
                              <span>More features available at higher levels</span>
                            ) : (
                              <span>Maximum level reached</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && characterToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4 text-red-500">
              <FaExclamationTriangle className="text-2xl mr-2" />
              <h2 className="text-2xl font-bold">Confirm Delete</h2>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{characterToDelete.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCharacterToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 