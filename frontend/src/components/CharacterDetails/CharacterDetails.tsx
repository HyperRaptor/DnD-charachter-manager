import React from 'react';
import { FaTrash, FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa';
import { Character, Species, Background, CharacterClass } from '../../types/character';

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
}

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
  onSave
}) => {
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold">Species</h3>
                  <p>{character.species.name}</p>
                  <div className="mt-2 space-y-1">
                    {character.species.traits.map(trait => (
                      <div key={trait.id} className="text-sm text-gray-600">
                        <span className="font-medium">{trait.title}:</span> {trait.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Background</h3>
                  <p>{character.background.name}</p>
                  <div className="mt-2 space-y-1">
                    {character.background.features.map(feature => (
                      <div key={feature.id} className="text-sm text-gray-600">
                        <span className="font-medium">{feature.title}:</span> {feature.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Class</h3>
                  <p>{character.characterClass.name} (Level {character.level})</p>
                  <p className="text-sm text-gray-500">Hit Die: {character.characterClass.hitDie}</p>
                  
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
                              value={character.temporaryHp}
                              onChange={(e) => onHpChange('temporaryHp', parseInt(e.target.value) || 0)}
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
                                value={character.currentHp}
                                onChange={(e) => onHpChange('currentHp', parseInt(e.target.value) || 0)}
                                className="w-14 p-1 text-center border rounded"
                                min="0"
                                max="999"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm">Max HP:</label>
                              <input
                                type="number"
                                value={character.maxHp}
                                onChange={(e) => onHpChange('maxHp', parseInt(e.target.value) || 0)}
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
                            value={character.speed}
                            onChange={(e) => onSpeedChange(parseInt(e.target.value) || 0)}
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
                            value={character.strength}
                            onChange={(e) => onAbilityScoreChange('strength', parseInt(e.target.value) || 0)}
                            className="w-12 p-1 text-center border rounded"
                            min="0"
                            max="99"
                          />
                          <span className={`w-8 text-center ${character.strengthModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {character.strengthModifier >= 0 ? '+' : ''}{character.strengthModifier}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">DEX:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={character.dexterity}
                            onChange={(e) => onAbilityScoreChange('dexterity', parseInt(e.target.value) || 0)}
                            className="w-12 p-1 text-center border rounded"
                            min="0"
                            max="99"
                          />
                          <span className={`w-8 text-center ${character.dexterityModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {character.dexterityModifier >= 0 ? '+' : ''}{character.dexterityModifier}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">CON:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={character.constitution}
                            onChange={(e) => onAbilityScoreChange('constitution', parseInt(e.target.value) || 0)}
                            className="w-12 p-1 text-center border rounded"
                            min="0"
                            max="99"
                          />
                          <span className={`w-8 text-center ${character.constitutionModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {character.constitutionModifier >= 0 ? '+' : ''}{character.constitutionModifier}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">INT:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={character.intelligence}
                            onChange={(e) => onAbilityScoreChange('intelligence', parseInt(e.target.value) || 0)}
                            className="w-12 p-1 text-center border rounded"
                            min="0"
                            max="99"
                          />
                          <span className={`w-8 text-center ${character.intelligenceModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {character.intelligenceModifier >= 0 ? '+' : ''}{character.intelligenceModifier}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">WIS:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={character.wisdom}
                            onChange={(e) => onAbilityScoreChange('wisdom', parseInt(e.target.value) || 0)}
                            className="w-12 p-1 text-center border rounded"
                            min="0"
                            max="99"
                          />
                          <span className={`w-8 text-center ${character.wisdomModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {character.wisdomModifier >= 0 ? '+' : ''}{character.wisdomModifier}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">CHA:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={character.charisma}
                            onChange={(e) => onAbilityScoreChange('charisma', parseInt(e.target.value) || 0)}
                            className="w-12 p-1 text-center border rounded"
                            min="0"
                            max="99"
                          />
                          <span className={`w-8 text-center ${character.charismaModifier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {character.charismaModifier >= 0 ? '+' : ''}{character.charismaModifier}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Class Features */}
                  <div className="mt-4 space-y-1">
                    {character.characterClass.features
                      .filter(feature => feature.level <= character.level)
                      .sort((a, b) => a.level - b.level)
                      .map(feature => (
                        <div key={feature.id} className="text-sm text-gray-600">
                          <span className="font-medium">Level {feature.level} - {feature.title}:</span> {feature.description}
                        </div>
                      ))}
                    {character.characterClass.features.some(feature => feature.level > character.level) && (
                      <div className="mt-2 text-sm text-gray-500 italic">
                        {character.level < 20 ? (
                          <span>More features available at higher levels</span>
                        ) : (
                          <span>Maximum level reached</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
    </div>
  );
};

export default CharacterDetails; 