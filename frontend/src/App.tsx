import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSave, FaPlus, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface Trait {
  id: string;
  title: string;
  description: string;
}

interface Species {
  id: string;
  name: string;
  traits: Trait[];
}

interface Character {
  id: number;
  name: string;
  species: Species;
  createdAt: string;
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSpecies, setEditSpecies] = useState<Species | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterSpecies, setNewCharacterSpecies] = useState<Species | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const initializeData = async () => {
      console.log('Starting data initialization...');
      setError(null);
      try {
        console.log('Fetching species from:', `${apiUrl}/api/species`);
        const speciesResponse = await axios.get(`${apiUrl}/api/species`);
        console.log('Species response:', speciesResponse.data);
        
        if (!speciesResponse.data || speciesResponse.data.length === 0) {
          console.warn('No species data received');
          setError('No species available. Please check if the backend is properly initialized.');
          return;
        }
        
        setSpeciesList(speciesResponse.data);
        setNewCharacterSpecies(speciesResponse.data[0]);
        setEditSpecies(speciesResponse.data[0]);

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
        }
      }
    };

    console.log('UseEffect triggered with apiUrl:', apiUrl);
    initializeData();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/characters`);
      setCharacters(response.data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const createCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacterName || !newCharacterSpecies) {
      alert("Name and species are required.");
      return;
    }
    try {
      const characterData = {
        name: newCharacterName,
        speciesId: newCharacterSpecies.id
      };
      console.log('Sending character data:', characterData);
      
      const response = await axios.post(`${apiUrl}/api/characters`, characterData);
      console.log('Response:', response.data);
      
      setCharacters([...characters, response.data]);
      setShowCreateModal(false);
      setNewCharacterName('');
      setNewCharacterSpecies(speciesList[0] || null);
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

  const updateCharacter = async () => {
    if (!selectedCharacter || !editSpecies) return;
    try {
      const characterData = {
        name: editName,
        speciesId: editSpecies.id
      };
      console.log('Sending update data:', characterData);
      
      const response = await axios.put(`${apiUrl}/api/characters/${selectedCharacter.id}`, characterData);
      console.log('Response:', response.data);
      
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
        console.error('Server error details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        alert(`Error updating character: ${errorMessage}`);
      } else {
        alert('Error updating character. Please try again.');
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
      {/* Create Character Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Character</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={createCharacter} className="space-y-4">
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
                  <option value="" disabled>
                    Select a species
                  </option>
                  {speciesList.map(species => (
                    <option key={species.id} value={species.id}>
                      {species.name.charAt(0) + species.name.slice(1).toLowerCase()}
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
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Create Character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && characterToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
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
                  className={`p-3 rounded cursor-pointer ${
                    selectedCharacter?.id === character.id
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
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
                    {character.species.name}
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    {character.species.traits.map(trait => (
                      <div key={trait.id}>
                        <span className="font-semibold">{trait.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {selectedCharacter ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-4 w-full">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-2xl font-bold w-full border-b-2 border-blue-500 focus:outline-none"
                          placeholder="Character Name"
                        />
                        <div className="flex items-center space-x-4">
                          <label className="font-medium">Species:</label>
                          <select
                            value={editSpecies?.id || ''}
                            onChange={(e) => {
                              const selected = speciesList.find(s => s.id === e.target.value);
                              if (selected) setEditSpecies(selected);
                            }}
                            className="border rounded p-2 focus:outline-none focus:border-blue-500"
                          >
                            {speciesList.map(species => (
                              <option key={species.id} value={species.id}>
                                {species.name.charAt(0) + species.name.slice(1).toLowerCase()}
                              </option>
                            ))}
                          </select>
                          {editSpecies && (
                            <div className="text-sm text-gray-600 space-y-2">
                              {editSpecies.traits.map(trait => (
                                <div key={trait.id}>
                                  <span className="font-semibold">{trait.title}:</span> {trait.description}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h1 className="text-2xl font-bold">{selectedCharacter.name}</h1>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">Species:</span>
                            <span>{selectedCharacter.species.name}</span>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold">Traits:</h3>
                            {selectedCharacter.species.traits.map(trait => (
                              <div key={trait.id} className="pl-4 border-l-2 border-gray-200">
                                <h4 className="font-medium text-gray-700">{trait.title}</h4>
                                <p className="text-sm text-gray-600">{trait.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="ml-4">
                    {isEditing ? (
                      <button
                        onClick={updateCharacter}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditName(selectedCharacter.name);
                          setEditSpecies(selectedCharacter.species);
                        }}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Select a character or create a new one
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 