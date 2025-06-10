import React from 'react';
import { Character } from '../../types/character';

interface SpellsWeaponsTabProps {
  character: Character;
}

const SpellsWeaponsTab: React.FC<SpellsWeaponsTabProps> = ({ character }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Spells & Weapons</h3>
      </div>

      <div className="text-center py-12 text-gray-500">
        <p>Spells and weapons functionality coming soon...</p>
      </div>
    </div>
  );
};

export default SpellsWeaponsTab; 