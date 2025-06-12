import React from 'react';
import { Character } from '../../types/character';

interface CoreTabProps {
  character: Character;
  onHpChange: (field: 'temporaryHp' | 'currentHp' | 'maxHp', value: number) => void;
  onSpeedChange: (value: number) => void;
  onAbilityScoreChange: (ability: string, value: number) => void;
  onLevelChange: (newLevel: number) => void;
}

const CoreTab: React.FC<CoreTabProps> = ({
  character,
  onHpChange,
  onSpeedChange,
  onAbilityScoreChange,
  onLevelChange
}) => {
  return (
    <div className="space-y-6">
      {/* Level Section */}
      <div className="space-y-4">
        <h4 className="font-medium">Level</h4>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLevelChange(character.level - 1)}
            disabled={character.level <= 1}
            className="bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="p-2 text-2xl font-bold w-12 text-center">{character.level}</span>
          <button
            onClick={() => onLevelChange(character.level + 1)}
            disabled={character.level >= 20}
            className="bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* HP and Speed Section */}
      <div className="space-y-4">
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
      <div>
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
    </div>
  );
};

export default CoreTab; 