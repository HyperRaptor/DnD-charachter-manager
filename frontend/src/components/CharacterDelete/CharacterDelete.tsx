import React from 'react';
import axios from 'axios';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Character } from '../../types/character';

interface CharacterDeleteProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onCharacterDeleted: (characterId: number) => void;
  apiUrl: string;
}

const CharacterDelete: React.FC<CharacterDeleteProps> = ({ 
  character, 
  isOpen, 
  onClose, 
  onCharacterDeleted, 
  apiUrl 
}) => {
  const confirmDelete = async () => {
    if (!character) return;
    try {
      await axios.delete(`${apiUrl}/api/characters/${character.id}`);
      onCharacterDeleted(character.id);
      onClose();
    } catch (error) {
      console.error('Error deleting character:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error deleting character: ${error.response.data}`);
      } else {
        alert('Error deleting character. Please try again.');
      }
    }
  };

  if (!isOpen || !character) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4 text-red-500 dark:text-red-400">
          <FaExclamationTriangle className="text-2xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Confirm Delete</h2>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <span className="font-semibold">{character.name}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterDelete; 