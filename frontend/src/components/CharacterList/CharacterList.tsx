import React from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Character } from '../../types/character';

interface CharacterListProps {
  characters: Character[];
  onCharacterSelect: (character: Character) => void;
  onCharacterDelete: (e: React.MouseEvent, character: Character) => void;
  onCreateNew: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onCharacterSelect,
  onCharacterDelete,
  onCreateNew
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Characters</h2>
          <button
            onClick={onCreateNew}
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
              onClick={() => onCharacterSelect(character)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate">{character.name}</h3>
                <button
                  onClick={(e) => onCharacterDelete(e, character)}
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
  );
};

export default CharacterList; 