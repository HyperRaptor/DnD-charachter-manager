import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { Character, Species, Background, CharacterClass } from '../../types/character';

interface CharacterCreateProps {
  onClose: () => void;
  onCharacterCreated: (character: Character) => void;
  apiUrl: string;
}

const CharacterCreate: React.FC<CharacterCreateProps> = ({ onClose, onCharacterCreated, apiUrl }) => {
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterSpecies, setNewCharacterSpecies] = useState<Species | null>(null);
  const [newCharacterBackground, setNewCharacterBackground] = useState<Background | null>(null);
  const [newCharacterClass, setNewCharacterClass] = useState<CharacterClass | null>(null);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [backgroundList, setBackgroundList] = useState<Background[]>([]);
  const [classList, setClassList] = useState<CharacterClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newCharacterStrength, setNewCharacterStrength] = useState(0);
  const [newCharacterDexterity, setNewCharacterDexterity] = useState(0);
  const [newCharacterConstitution, setNewCharacterConstitution] = useState(0);
  const [newCharacterIntelligence, setNewCharacterIntelligence] = useState(0);
  const [newCharacterWisdom, setNewCharacterWisdom] = useState(0);
  const [newCharacterCharisma, setNewCharacterCharisma] = useState(0);

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
        setNewCharacterSpecies(speciesResponse.data[0]);

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
        setNewCharacterBackground(backgroundsResponse.data[0]);

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
        setNewCharacterClass(classesResponse.data[0]);
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
  }, [apiUrl]);

  const createCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacterName || !newCharacterSpecies || !newCharacterBackground || !newCharacterClass) {
      alert("Name, species, background, and class are required.");
      return;
    }
    try {
      const characterData = {
        name: newCharacterName,
        speciesId: newCharacterSpecies.id,
        backgroundId: newCharacterBackground.id,
        classId: newCharacterClass.id,
        level: 1,
        strength: newCharacterStrength,
        dexterity: newCharacterDexterity,
        constitution: newCharacterConstitution,
        intelligence: newCharacterIntelligence,
        wisdom: newCharacterWisdom,
        charisma: newCharacterCharisma
      };
      console.log('Sending character data:', characterData);
      
      const response = await axios.post(`${apiUrl}/api/characters`, characterData);
      console.log('Response:', response.data);
      
      onCharacterCreated(response.data);
      handleClose();
    } catch (error) {
      console.error('Error creating character:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data, null, 2);
        console.error('Server error details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        alert(`Error creating character: ${errorMessage}`);
      } else {
        alert('Error creating character. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setNewCharacterName('');
    setNewCharacterSpecies(speciesList[0] || null);
    setNewCharacterBackground(backgroundList[0] || null);
    setNewCharacterClass(classList[0] || null);
    setNewCharacterStrength(0);
    setNewCharacterDexterity(0);
    setNewCharacterConstitution(0);
    setNewCharacterIntelligence(0);
    setNewCharacterWisdom(0);
    setNewCharacterCharisma(0);
    onClose();
  };

  function calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Character</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={createCharacter} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Character Name
            </label>
            <input
              type="text"
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter character name"
              required
            />
          </div>

          {/* Species Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Species
            </label>
            <select
              value={newCharacterSpecies?.id || ''}
              onChange={(e) => {
                const selected = speciesList.find(s => s.id === e.target.value);
                setNewCharacterSpecies(selected || null);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a species</option>
              {speciesList.map(species => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
            </select>
            {newCharacterSpecies && (
              <div className="mt-2 space-y-2">
                {newCharacterSpecies.traits.map(trait => (
                  <div key={trait.id} className="text-sm text-gray-600">
                    <span className="font-semibold">{trait.title}:</span> {trait.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Background Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <select
              value={newCharacterBackground?.id || ''}
              onChange={(e) => {
                const selected = backgroundList.find(b => b.id === e.target.value);
                setNewCharacterBackground(selected || null);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a background</option>
              {backgroundList.map(background => (
                <option key={background.id} value={background.id}>
                  {background.name}
                </option>
              ))}
            </select>
            {newCharacterBackground && (
              <div className="mt-2 space-y-2">
                {newCharacterBackground.features.map(feature => (
                  <div key={feature.id} className="text-sm text-gray-600">
                    <span className="font-semibold">{feature.title}:</span> {feature.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={newCharacterClass?.id || ''}
              onChange={(e) => {
                const selected = classList.find(c => c.id === e.target.value);
                setNewCharacterClass(selected || null);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a class</option>
              {classList.map(characterClass => (
                <option key={characterClass.id} value={characterClass.id}>
                  {characterClass.name} (Hit Die: {characterClass.hitDie})
                </option>
              ))}
            </select>
            {newCharacterClass && (
              <div className="mt-2 space-y-2">
                {newCharacterClass.features.map(feature => (
                  <div key={feature.id} className="text-sm text-gray-600">
                    <span className="font-semibold">Level {feature.level} - {feature.title}:</span> {feature.description}
                  </div>
                ))}
              </div>
            )}
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
                    value={newCharacterStrength}
                    onChange={(e) => setNewCharacterStrength(parseInt(e.target.value) || 0)}
                    className="w-12 p-1 text-center border rounded"
                    min="0"
                    max="99"
                  />
                  <span className={`w-8 text-center ${calculateModifier(newCharacterStrength) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateModifier(newCharacterStrength) >= 0 ? '+' : ''}{calculateModifier(newCharacterStrength)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">DEX:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newCharacterDexterity}
                    onChange={(e) => setNewCharacterDexterity(parseInt(e.target.value) || 0)}
                    className="w-12 p-1 text-center border rounded"
                    min="0"
                    max="99"
                  />
                  <span className={`w-8 text-center ${calculateModifier(newCharacterDexterity) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateModifier(newCharacterDexterity) >= 0 ? '+' : ''}{calculateModifier(newCharacterDexterity)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">CON:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newCharacterConstitution}
                    onChange={(e) => setNewCharacterConstitution(parseInt(e.target.value) || 0)}
                    className="w-12 p-1 text-center border rounded"
                    min="0"
                    max="99"
                  />
                  <span className={`w-8 text-center ${calculateModifier(newCharacterConstitution) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateModifier(newCharacterConstitution) >= 0 ? '+' : ''}{calculateModifier(newCharacterConstitution)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">INT:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newCharacterIntelligence}
                    onChange={(e) => setNewCharacterIntelligence(parseInt(e.target.value) || 0)}
                    className="w-12 p-1 text-center border rounded"
                    min="0"
                    max="99"
                  />
                  <span className={`w-8 text-center ${calculateModifier(newCharacterIntelligence) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateModifier(newCharacterIntelligence) >= 0 ? '+' : ''}{calculateModifier(newCharacterIntelligence)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">WIS:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newCharacterWisdom}
                    onChange={(e) => setNewCharacterWisdom(parseInt(e.target.value) || 0)}
                    className="w-12 p-1 text-center border rounded"
                    min="0"
                    max="99"
                  />
                  <span className={`w-8 text-center ${calculateModifier(newCharacterWisdom) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateModifier(newCharacterWisdom) >= 0 ? '+' : ''}{calculateModifier(newCharacterWisdom)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">CHA:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newCharacterCharisma}
                    onChange={(e) => setNewCharacterCharisma(parseInt(e.target.value) || 0)}
                    className="w-12 p-1 text-center border rounded"
                    min="0"
                    max="99"
                  />
                  <span className={`w-8 text-center ${calculateModifier(newCharacterCharisma) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateModifier(newCharacterCharisma) >= 0 ? '+' : ''}{calculateModifier(newCharacterCharisma)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreate; 