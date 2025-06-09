import React, { useState } from 'react';
import { FaTrash, FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa';
import { Character, Species, Background, CharacterClass } from '../../types/character';
import CoreTab from './CoreTab';
import ReferenceTab from './ReferenceTab';
import InventoryTab from './InventoryTab';

interface CharacterDetailsProps {
  character: Character;
  onBack: () => void;
  onDelete: (e: React.MouseEvent, character: Character) => void;
  onLevelChange: (newLevel: number) => void;
  onHpChange: (field: 'temporaryHp' | 'currentHp' | 'maxHp', value: number) => void;
  onSpeedChange: (value: number) => void;
  onAbilityScoreChange: (ability: string, value: number) => void;
  speciesList: Species[];
  backgroundList: Background[];
  classList: CharacterClass[];
  editName: string;
  setEditName: (name: string) => void;
  editSpecies: Species | null;
  setEditSpecies: (species: Species | null) => void;
  editBackground: Background | null;
  setEditBackground: (background: Background | null) => void;
  editClass: CharacterClass | null;
  setEditClass: (characterClass: CharacterClass | null) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave: () => void;
  apiUrl: string;
  onCharacterUpdated: (character: Character) => void;
}

type TabType = 'core' | 'reference' | 'inventory';

const CharacterDetails: React.FC<CharacterDetailsProps> = ({
  character,
  onBack,
  onDelete,
  onLevelChange,
  onHpChange,
  onSpeedChange,
  onAbilityScoreChange,
  speciesList,
  backgroundList,
  classList,
  editName,
  setEditName,
  editSpecies,
  setEditSpecies,
  editBackground,
  setEditBackground,
  editClass,
  setEditClass,
  isEditing,
  setIsEditing,
  onSave,
  apiUrl,
  onCharacterUpdated
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('core');

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
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
            {isEditing && (
              <button
                onClick={onSave}
                className="p-2 text-green-600 hover:text-green-800"
              >
                <FaSave className="text-2xl" />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6">
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
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{character.name}</h1>
              <div className="flex items-center space-x-4">
                <label className="font-medium">Level:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      console.log('Decrease level clicked. Current level:', character.level);
                      onLevelChange(character.level - 1);
                    }}
                    disabled={character.level <= 1}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{character.level}</span>
                  <button
                    onClick={() => {
                      console.log('Increase level clicked. Current level:', character.level);
                      onLevelChange(character.level + 1);
                    }}
                    disabled={character.level >= 20}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('core')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'core'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Core
                </button>
                <button
                  onClick={() => setActiveTab('reference')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reference'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reference
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'inventory'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Inventory
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'core' && (
              <CoreTab
                character={character}
                onHpChange={onHpChange}
                onSpeedChange={onSpeedChange}
                onAbilityScoreChange={onAbilityScoreChange}
              />
            )}
            {activeTab === 'reference' && (
              <ReferenceTab character={character} />
            )}
            {activeTab === 'inventory' && (
              <InventoryTab 
                character={character} 
                apiUrl={apiUrl}
                onCharacterUpdated={onCharacterUpdated}
              />
            )}

            {/* Delete Button - Moved to bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={(e) => onDelete(e, character)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaTrash className="text-lg" />
                  <span>Delete Character</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterDetails; 