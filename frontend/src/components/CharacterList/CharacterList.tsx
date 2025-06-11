import React from 'react';
import { FaTrash, FaPlus, FaBug } from 'react-icons/fa';
import { Character } from '../../types/character';

interface CharacterListProps {
  characters: Character[];
  onCharacterSelect: (character: Character) => void;
  onCharacterDelete: (e: React.MouseEvent, character: Character) => void;
  onCreateNew: () => void;
  onCreateDebug?: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onCharacterSelect,
  onCharacterDelete,
  onCreateNew,
  onCreateDebug
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Characters</h2>
          <div className="flex space-x-2">
            {onCreateDebug && (
              <button
                onClick={onCreateDebug}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
                title="Create Debug Character"
              >
                <FaBug />
              </button>
            )}
            <button
              onClick={onCreateNew}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              title="Create New Character"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {characters.map(character => (
            <div
              key={character.id}
              className="p-8 border-2 border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-200 shadow-md bg-white dark:bg-slate-900"
              onClick={() => onCharacterSelect(character)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg truncate text-gray-800 dark:text-white">{character.name}</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {character.species.name} {character.characterClass.name} {character.level}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {character.background.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterList; 