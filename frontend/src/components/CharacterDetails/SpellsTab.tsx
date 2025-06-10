import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Character } from '../../types/character';

interface SpellSlot {
  level: number;
  used: number;
  max: number;
}

interface Spell {
  id: string;
  name: string;
  castTime: string;
  gainedFrom: string;
  targetArea: string;
  range: string;
  duration: string;
  description: string;
  materialComponents: string;
  school: string;
  prepared: string;
  spellLevel: string;
  concentration: boolean;
  ritual: boolean;
  verbal: boolean;
  somatic: boolean;
  material: boolean;
}

interface SpellsTabProps {
  character: Character;
  apiUrl: string;
  onCharacterUpdated: (character: Character) => void;
}

const SpellsTab: React.FC<SpellsTabProps> = ({ character, apiUrl, onCharacterUpdated }) => {
  // Initialize spell slots from character data or create defaults
  const getSpellSlots = (): SpellSlot[] => {
    if (character.spellSlots && character.spellSlots !== 'null' && character.spellSlots !== 'undefined' && character.spellSlots !== '') {
      try {
        const slots = typeof character.spellSlots === 'string' 
          ? JSON.parse(character.spellSlots) 
          : character.spellSlots;
        
        // If it's an array and has the expected structure, return it
        if (Array.isArray(slots) && slots.length > 0 && slots[0].hasOwnProperty('level')) {
          return slots;
        }
        // If it's an empty array or doesn't have the right structure, return defaults
      } catch (e) {
        console.error('Error parsing spell slots:', e);
      }
    }
    
    // Default spell slots for levels 1-9
    return Array.from({ length: 9 }, (_, i) => ({
      level: i + 1,
      used: 0,
      max: 0
    }));
  };

  // Initialize spells from character data or create defaults
  const getSpells = (): Spell[] => {
    if (character.spells && character.spells !== 'null' && character.spells !== 'undefined' && character.spells !== '') {
      try {
        const spells = typeof character.spells === 'string' 
          ? JSON.parse(character.spells) 
          : character.spells;
        
        if (Array.isArray(spells)) {
          return spells;
        }
      } catch (e) {
        console.error('Error parsing spells:', e);
      }
    }
    
    return [];
  };

  const [spellSlots, setSpellSlots] = useState<SpellSlot[]>(getSpellSlots());
  const [isSaving, setIsSaving] = useState(false);
  const [spells, setSpells] = useState<Spell[]>(getSpells());

  // Sync state when character data changes
  useEffect(() => {
    setSpellSlots(getSpellSlots());
    setSpells(getSpells());
  }, [character.spellSlots, character.spells]);

  const saveSpells = async (updatedSpells: Spell[]) => {
    try {
      const response = await axios.put(`${apiUrl}/api/characters/${character.id}/spells`, {
        spells: JSON.stringify(updatedSpells)
      });
      onCharacterUpdated(response.data);
    } catch (error) {
      console.error('Error saving spells:', error);
    }
  };

  const handleSpellSlotChange = async (level: number, field: 'used' | 'max', value: number) => {
    const newSpellSlots = spellSlots.map(slot => 
      slot.level === level ? { ...slot, [field]: value } : slot
    );
    
    setSpellSlots(newSpellSlots);
    setIsSaving(true);

    // Update character in backend
    try {
      const response = await axios.put(`${apiUrl}/api/characters/${character.id}/spell-slots`, {
        spellSlots: JSON.stringify(newSpellSlots)
      });

      onCharacterUpdated(response.data);
    } catch (error) {
      console.error('Error updating spell slots:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetUsedSlots = async () => {
    const resetSlots = spellSlots.map(slot => ({ ...slot, used: 0 }));
    setSpellSlots(resetSlots);
    setIsSaving(true);

    try {
      const response = await axios.put(`${apiUrl}/api/characters/${character.id}/spell-slots`, {
        spellSlots: JSON.stringify(resetSlots)
      });

      onCharacterUpdated(response.data);
    } catch (error) {
      console.error('Error resetting spell slots:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addSpell = () => {
    const newSpell: Spell = {
      id: Date.now().toString(),
      name: '',
      castTime: '',
      gainedFrom: '',
      targetArea: '',
      range: '',
      duration: '',
      description: '',
      materialComponents: '',
      school: '',
      prepared: '',
      spellLevel: '',
      concentration: false,
      ritual: false,
      verbal: false,
      somatic: false,
      material: false
    };
    const updatedSpells = [...spells, newSpell];
    setSpells(updatedSpells);
    saveSpells(updatedSpells);
  };

  const updateSpellField = (id: string, field: keyof Spell, value: string | boolean) => {
    const updatedSpells = spells.map(spell => 
      spell.id === id ? { ...spell, [field]: value } : spell
    );
    setSpells(updatedSpells);
    
    // Auto-save after a short delay
    setTimeout(() => {
      saveSpells(updatedSpells);
    }, 1000);
  };

  const removeSpell = (id: string) => {
    const updatedSpells = spells.filter(spell => spell.id !== id);
    setSpells(updatedSpells);
    saveSpells(updatedSpells);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Spell Slots</h3>
        <button
          onClick={resetUsedSlots}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
        >
          Reset Used Slots
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Used
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Max
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {spellSlots.map((slot) => {
              const remaining = slot.max - slot.used;
              const isOverUsed = slot.used > slot.max;
              
              return (
                <tr key={slot.level} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm text-gray-800">
                      {slot.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={slot.used}
                      onChange={(e) => handleSpellSlotChange(slot.level, 'used', parseInt(e.target.value) || 0)}
                      className={`w-12 p-1 border rounded focus:outline-none focus:border-blue-500 text-sm text-center ${
                        isOverUsed ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={slot.max}
                      onChange={(e) => handleSpellSlotChange(slot.level, 'max', parseInt(e.target.value) || 0)}
                      className="w-12 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm text-center"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      isOverUsed ? 'text-red-600' : remaining > 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {remaining}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spells Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Spells</h3>
          <button
            onClick={addSpell}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Add Spell
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {spells.map((spell) => (
            <div key={spell.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-800">Spell</h4>
                <button
                  onClick={() => removeSpell(spell.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={spell.name}
                    onChange={(e) => updateSpellField(spell.id, 'name', e.target.value)}
                    placeholder="Spell name..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={spell.spellLevel}
                    onChange={(e) => updateSpellField(spell.id, 'spellLevel', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Level</option>
                    <option value="Cantrip">Cantrip</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cast Time</label>
                  <input
                    type="text"
                    value={spell.castTime}
                    onChange={(e) => updateSpellField(spell.id, 'castTime', e.target.value)}
                    placeholder="e.g., 1 action, 1 bonus action..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gained From</label>
                  <input
                    type="text"
                    value={spell.gainedFrom}
                    onChange={(e) => updateSpellField(spell.id, 'gainedFrom', e.target.value)}
                    placeholder="e.g., Class, Race, Feat..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target/Area of Effect</label>
                  <input
                    type="text"
                    value={spell.targetArea}
                    onChange={(e) => updateSpellField(spell.id, 'targetArea', e.target.value)}
                    placeholder="e.g., Self, 30-foot cone..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Range</label>
                  <input
                    type="text"
                    value={spell.range}
                    onChange={(e) => updateSpellField(spell.id, 'range', e.target.value)}
                    placeholder="e.g., Touch, 60 feet..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={spell.duration}
                    onChange={(e) => updateSpellField(spell.id, 'duration', e.target.value)}
                    placeholder="e.g., Instantaneous, 1 hour..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Components</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={spell.verbal}
                        onChange={(e) => updateSpellField(spell.id, 'verbal', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">V</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={spell.somatic}
                        onChange={(e) => updateSpellField(spell.id, 'somatic', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">S</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={spell.material}
                        onChange={(e) => updateSpellField(spell.id, 'material', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Properties</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={spell.concentration}
                        onChange={(e) => updateSpellField(spell.id, 'concentration', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Concentration</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={spell.ritual}
                        onChange={(e) => updateSpellField(spell.id, 'ritual', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Ritual</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <select
                    value={spell.school}
                    onChange={(e) => updateSpellField(spell.id, 'school', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select School</option>
                    <option value="Abjuration">Abjuration</option>
                    <option value="Conjuration">Conjuration</option>
                    <option value="Divination">Divination</option>
                    <option value="Enchantment">Enchantment</option>
                    <option value="Evocation">Evocation</option>
                    <option value="Illusion">Illusion</option>
                    <option value="Necromancy">Necromancy</option>
                    <option value="Transmutation">Transmutation</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prepared?</label>
                  <select
                    value={spell.prepared}
                    onChange={(e) => updateSpellField(spell.id, 'prepared', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Always">Always</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={spell.description}
                    onChange={(e) => updateSpellField(spell.id, 'description', e.target.value)}
                    placeholder="Spell description..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm resize-vertical"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={spell.material}
                        onChange={(e) => updateSpellField(spell.id, 'material', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Material Components</span>
                    </div>
                    <input
                      type="text"
                      value={spell.materialComponents}
                      onChange={(e) => updateSpellField(spell.id, 'materialComponents', e.target.value)}
                      placeholder="Material components..."
                      disabled={!spell.material}
                      className={`flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 text-sm ${
                        spell.material 
                          ? 'border-gray-300 bg-white' 
                          : 'border-gray-200 bg-gray-100 text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {spells.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No spells added yet. Click "Add Spell" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellsTab; 