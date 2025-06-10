import React from 'react';
import { Character } from '../../types/character';

interface ReferenceTabProps {
  character: Character;
}

const ReferenceTab: React.FC<ReferenceTabProps> = ({ character }) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ReferenceTab; 