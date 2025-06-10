import React, { useState, useEffect } from 'react';
import { Character } from '../../types/character';
import { FaArrowUp, FaArrowDown, FaMagic, FaCrosshairs, FaStar, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface SpellsWeaponsTabProps {
  character: Character;
  apiUrl?: string;
  onCharacterUpdated?: (character: Character) => void;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface ClassAction {
  id: string;
  name: string;
  description: string;
  gainedFrom: string;
  currentlyUsed: number;
  maxUses: number;
}

interface Weapon {
  id: string;
  proficient: boolean;
  name: string;
  attackType: string;
  stat: string;
  magicBonus: number;
  toHit: number;
  damageDice: string;
  plusStat: boolean;
  damageBonus: number;
  damageType: string;
  critDamage: string;
  critOn: number;
}

const SpellsWeaponsTab: React.FC<SpellsWeaponsTabProps> = ({ character, apiUrl, onCharacterUpdated }) => {
  const [classActions, setClassActions] = useState<ClassAction[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load class actions data from character
  useEffect(() => {
    setIsLoading(true);
    try {
      if (character.classActions) {
        const loadedActions = JSON.parse(character.classActions);
        if (loadedActions.length === 0) {
          // Initialize with one empty action if no actions exist
          setClassActions([{
            id: Date.now().toString(),
            name: '',
            description: '',
            gainedFrom: '',
            currentlyUsed: 0,
            maxUses: 0
          }]);
        } else {
          setClassActions(loadedActions);
        }
      } else {
        // Initialize with one empty action if no classActions field exists
        setClassActions([{
          id: Date.now().toString(),
          name: '',
          description: '',
          gainedFrom: '',
          currentlyUsed: 0,
          maxUses: 0
        }]);
      }
    } catch (error) {
      console.error('Error parsing class actions:', error);
      // Initialize with one empty action if parsing fails
      setClassActions([{
        id: Date.now().toString(),
        name: '',
        description: '',
        gainedFrom: '',
        currentlyUsed: 0,
        maxUses: 0
      }]);
    }
    setIsLoading(false);
  }, [character.id]); // Only run when character ID changes, not when character object updates

  // Load weapons data from character
  useEffect(() => {
    setIsLoading(true);
    try {
      if (character.weapons) {
        const loadedWeapons = JSON.parse(character.weapons);
        if (loadedWeapons.length === 0) {
          // Initialize with one empty weapon if no weapons exist
          setWeapons([{
            id: Date.now().toString(),
            proficient: true,
            name: '',
            attackType: '',
            stat: '',
            magicBonus: 0,
            toHit: 0,
            damageDice: '',
            plusStat: true,
            damageBonus: 0,
            damageType: '',
            critDamage: '',
            critOn: 20
          }]);
        } else {
          setWeapons(loadedWeapons);
        }
      } else {
        // Initialize with one empty weapon if no weapons field exists
        setWeapons([{
          id: Date.now().toString(),
          proficient: true,
          name: '',
          attackType: '',
          stat: '',
          magicBonus: 0,
          toHit: 0,
          damageDice: '',
          plusStat: true,
          damageBonus: 0,
          damageType: '',
          critDamage: '',
          critOn: 20
        }]);
      }
    } catch (error) {
      console.error('Error parsing weapons:', error);
      // Initialize with one empty weapon if parsing fails
      setWeapons([{
        id: Date.now().toString(),
        proficient: true,
        name: '',
        attackType: '',
        stat: '',
        magicBonus: 0,
        toHit: 0,
        damageDice: '',
        plusStat: true,
        damageBonus: 0,
        damageType: '',
        critDamage: '',
        critOn: 20
      }]);
    }
    setIsLoading(false);
  }, [character.id]); // Only run when character ID changes, not when character object updates

  const saveClassActions = async (actions: ClassAction[]) => {
    if (!apiUrl || !onCharacterUpdated) return;
    
    try {
      const response = await axios.put(`${apiUrl}/api/characters/${character.id}/class-actions`, {
        classActions: JSON.stringify(actions)
      });
      onCharacterUpdated(response.data);
    } catch (error) {
      console.error('Error saving class actions:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error saving class actions: ${error.response.data}`);
      } else {
        alert('Error saving class actions. Please try again.');
      }
    }
  };

  const saveWeapons = async (weaponsData: Weapon[]) => {
    if (!apiUrl || !onCharacterUpdated) return;
    
    try {
      const response = await axios.put(`${apiUrl}/api/characters/${character.id}/weapons`, {
        weapons: JSON.stringify(weaponsData)
      });
      onCharacterUpdated(response.data);
    } catch (error) {
      console.error('Error saving weapons:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error saving weapons: ${error.response.data}`);
      } else {
        alert('Error saving weapons. Please try again.');
      }
    }
  };

  const addClassAction = () => {
    const newAction: ClassAction = {
      id: Date.now().toString(),
      name: '',
      description: '',
      gainedFrom: '',
      currentlyUsed: 0,
      maxUses: 0
    };
    const newActions = [...classActions, newAction];
    setClassActions(newActions);
    
    // Auto-save, but only if not loading
    if (!isLoading && apiUrl && onCharacterUpdated) {
      setTimeout(() => {
        saveClassActions(newActions);
      }, 1000);
    }
  };

  const removeClassAction = (id: string) => {
    if (classActions.length > 1) {
      const newActions = classActions.filter(action => action.id !== id);
      setClassActions(newActions);
      
      // Auto-save, but only if not loading
      if (!isLoading && apiUrl && onCharacterUpdated) {
        setTimeout(() => {
          saveClassActions(newActions);
        }, 1000);
      }
    }
  };

  const updateClassAction = (id: string, field: keyof ClassAction, value: string | number) => {
    const newActions = classActions.map(action => 
      action.id === id ? { ...action, [field]: value } : action
    );
    setClassActions(newActions);
    
    // Auto-save after a short delay, but only if not loading
    if (!isLoading && apiUrl && onCharacterUpdated) {
      setTimeout(() => {
        saveClassActions(newActions);
      }, 1000);
    }
  };

  const addWeapon = () => {
    const newWeapon: Weapon = {
      id: Date.now().toString(),
      proficient: true,
      name: '',
      attackType: '',
      stat: '',
      magicBonus: 0,
      toHit: 0,
      damageDice: '',
      plusStat: true,
      damageBonus: 0,
      damageType: '',
      critDamage: '',
      critOn: 20
    };
    const newWeapons = [...weapons, newWeapon];
    setWeapons(newWeapons);
    
    // Auto-save, but only if not loading
    if (!isLoading && apiUrl && onCharacterUpdated) {
      setTimeout(() => {
        saveWeapons(newWeapons);
      }, 1000);
    }
  };

  const removeWeapon = (id: string) => {
    if (weapons.length > 1) {
      const newWeapons = weapons.filter(weapon => weapon.id !== id);
      setWeapons(newWeapons);
      
      // Auto-save, but only if not loading
      if (!isLoading && apiUrl && onCharacterUpdated) {
        setTimeout(() => {
          saveWeapons(newWeapons);
        }, 1000);
      }
    }
  };

  const updateWeapon = (id: string, field: keyof Weapon, value: string | number | boolean) => {
    const newWeapons = weapons.map(weapon => 
      weapon.id === id ? { ...weapon, [field]: value } : weapon
    );
    setWeapons(newWeapons);
    
    // Auto-save after a short delay, but only if not loading
    if (!isLoading && apiUrl && onCharacterUpdated) {
      setTimeout(() => {
        saveWeapons(newWeapons);
      }, 1000);
    }
  };

  const calculateToHit = (weapon: Weapon) => {
    let total = 0;
    
    // Add proficiency bonus if proficient
    if (weapon.proficient) {
      const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
      total += proficiencyBonus;
    }
    
    // Add stat modifier
    let statModifier = 0;
    switch (weapon.stat) {
      case 'STR':
        statModifier = character.strengthModifier;
        break;
      case 'Finesse':
        statModifier = Math.max(character.strengthModifier, character.dexterityModifier);
        break;
      case 'DEX':
        statModifier = character.dexterityModifier;
        break;
      case 'CON':
        statModifier = character.constitutionModifier;
        break;
      case 'INT':
        statModifier = character.intelligenceModifier;
        break;
      case 'WIS':
        statModifier = character.wisdomModifier;
        break;
      case 'CHA':
        statModifier = character.charismaModifier;
        break;
    }
    total += statModifier;
    
    // Add magic bonus
    total += weapon.magicBonus;
    
    return total;
  };

  const calculateDamageBonus = (weapon: Weapon) => {
    let total = weapon.magicBonus; // Start with magic bonus
    
    // Add stat modifier if plusStat is checked
    if (weapon.plusStat) {
      let statModifier = 0;
      switch (weapon.stat) {
        case 'STR':
          statModifier = character.strengthModifier;
          break;
        case 'DEX':
          statModifier = character.dexterityModifier;
          break;
        case 'CON':
          statModifier = character.constitutionModifier;
          break;
        case 'INT':
          statModifier = character.intelligenceModifier;
          break;
        case 'WIS':
          statModifier = character.wisdomModifier;
          break;
        case 'CHA':
          statModifier = character.charismaModifier;
          break;
        case 'Finesse':
          // Use the higher of STR or DEX
          statModifier = Math.max(character.strengthModifier, character.dexterityModifier);
          break;
      }
      total += statModifier;
    }
    
    return total;
  };

  const rollAttack = (weapon: Weapon) => {
    // Calculate attack bonus
    let attackBonus = 0;
    
    // Add proficiency bonus if proficient
    if (weapon.proficient) {
      const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
      attackBonus += proficiencyBonus;
    }
    
    // Add stat modifier
    let statModifier = 0;
    switch (weapon.stat) {
      case 'STR':
        statModifier = character.strengthModifier;
        break;
      case 'DEX':
        statModifier = character.dexterityModifier;
        break;
      case 'CON':
        statModifier = character.constitutionModifier;
        break;
      case 'INT':
        statModifier = character.intelligenceModifier;
        break;
      case 'WIS':
        statModifier = character.wisdomModifier;
        break;
      case 'CHA':
        statModifier = character.charismaModifier;
        break;
      case 'Finesse':
        // Use the higher of STR or DEX
        statModifier = Math.max(character.strengthModifier, character.dexterityModifier);
        break;
    }
    attackBonus += statModifier;
    
    // Add magic bonus
    attackBonus += weapon.magicBonus;
    
    // Roll the d20
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + attackBonus;
    
    // Determine if it's a critical hit
    const isCritical = roll >= weapon.critOn;
    const isCriticalMiss = roll === 1;
    
    // Build result message
    let resultMessage = `Attack Roll: ${roll}`;
    if (weapon.proficient) {
      const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
      resultMessage += ` + ${proficiencyBonus} (proficiency)`;
    }
    if (statModifier !== 0) {
      resultMessage += ` + ${statModifier >= 0 ? '+' : ''}${statModifier} (${weapon.stat})`;
    }
    if (weapon.magicBonus > 0) {
      resultMessage += ` + ${weapon.magicBonus} (magic)`;
    }
    resultMessage += ` = ${total}`;

    // Calculate damage for all rolls (including misses)
    resultMessage += `\n\nDamage:`;
    
    // Calculate damage bonus (stat modifier only added once)
    let damageBonus = weapon.magicBonus;
    if (weapon.plusStat) {
      damageBonus += statModifier;
    }
    
    let totalDamage = 0;
    
    // Always roll normal damage first
    if (weapon.damageDice) {
      const damageRoll = rollDice(weapon.damageDice);
      resultMessage += `\nNormal Damage: ${weapon.damageDice} = ${damageRoll}`;
      totalDamage += damageRoll;
    }
    
    if (isCritical) {
      // Add critical damage on top of normal damage
      if (weapon.critDamage) {
        const critDice = weapon.critDamage;
        const critRoll = rollDice(critDice);
        resultMessage += `\nCritical Damage: ${critDice} = ${critRoll}`;
        totalDamage += critRoll;
      } else if (weapon.damageDice) {
        // Double the normal damage dice for crit (additional dice)
        const normalDice = weapon.damageDice;
        const critDice = doubleDice(normalDice);
        const critRoll = rollDice(critDice);
        resultMessage += `\nCritical Damage: ${critDice} = ${critRoll}`;
        totalDamage += critRoll;
      }
    }
    
    // Add damage bonus once to the total
    if (damageBonus !== 0) {
      resultMessage += `\nDamage Bonus: ${damageBonus >= 0 ? '+' : ''}${damageBonus}`;
      totalDamage += damageBonus;
    }
    
    resultMessage += `\nTotal Damage: ${totalDamage}`;
    
    if (weapon.damageType) {
      resultMessage += `\nDamage Type: ${weapon.damageType}`;
    }
    
    alert(resultMessage);
  };

  const rollDice = (diceNotation: string): number => {
    // Parse dice notation like "2d6", "1d8", or "d6" (assumes 1 if no number before d)
    const match = diceNotation.match(/(\d*)d(\d+)/);
    if (!match) return 0;
    
    const numDice = match[1] ? parseInt(match[1]) : 1; // Default to 1 if no number before d
    const diceSize = parseInt(match[2]);
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * diceSize) + 1;
    }
    
    return total;
  };

  const doubleDice = (diceNotation: string): string => {
    // Double the number of dice for critical hits
    const match = diceNotation.match(/(\d*)d(\d+)/);
    if (!match) return diceNotation;
    
    const numDice = match[1] ? parseInt(match[1]) : 1; // Default to 1 if no number before d
    const diceSize = match[2];
    
    return `${numDice * 2}d${diceSize}`;
  };

  const [activeSection, setActiveSection] = useState<string>('weapons');

  // Jump to section
  const jumpToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    // Scroll to the section
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Define sections with current state
  const sections = [
    {
      id: 'weapons',
      title: 'Weapons',
      icon: <FaCrosshairs className="text-red-600" />,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-medium text-gray-700">Weapons</h5>
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              onClick={addWeapon}
            >
              <FaPlus />
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Prof?
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Weapon
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Attack
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Stat
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Magic Bonus
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      To Hit
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Damage Dice
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      + Stat?
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Dmg Bonus
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Damage Type
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Crit Dmg
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Crit on a
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Attack
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {weapons.map((weapon) => (
                    <React.Fragment key={weapon.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-3">
                          <input
                            type="checkbox"
                            checked={weapon.proficient}
                            onChange={(e) => updateWeapon(weapon.id, 'proficient', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={weapon.name}
                            onChange={(e) => updateWeapon(weapon.id, 'name', e.target.value)}
                            className="w-24 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="Weapon name"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={weapon.attackType}
                            onChange={(e) => updateWeapon(weapon.id, 'attackType', e.target.value)}
                            className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                          >
                            <option value="">Type</option>
                            <option value="Melee">Melee</option>
                            <option value="Ranged">Ranged</option>
                            <option value="Thrown">Thrown</option>
                          </select>
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={weapon.stat}
                            onChange={(e) => updateWeapon(weapon.id, 'stat', e.target.value)}
                            className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                          >
                            <option value="">Stat</option>
                            <option value="STR">STR</option>
                            <option value="Finesse">Finesse</option>
                            <option value="DEX">DEX</option>
                            <option value="CON">CON</option>
                            <option value="INT">INT</option>
                            <option value="WIS">WIS</option>
                            <option value="CHA">CHA</option>
                          </select>
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            value={weapon.magicBonus}
                            onChange={(e) => updateWeapon(weapon.id, 'magicBonus', parseInt(e.target.value) || 0)}
                            className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                            min="0"
                            max="99"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm font-medium text-gray-800">
                            {calculateToHit(weapon)}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={weapon.damageDice}
                            onChange={(e) => updateWeapon(weapon.id, 'damageDice', e.target.value)}
                            className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="1d8"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="checkbox"
                            checked={weapon.plusStat}
                            onChange={(e) => updateWeapon(weapon.id, 'plusStat', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm font-medium text-gray-800">
                            {calculateDamageBonus(weapon)}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={weapon.damageType}
                            onChange={(e) => updateWeapon(weapon.id, 'damageType', e.target.value)}
                            className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="Slashing"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={weapon.critDamage}
                            onChange={(e) => updateWeapon(weapon.id, 'critDamage', e.target.value)}
                            className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="2d8"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            value={weapon.critOn}
                            onChange={(e) => updateWeapon(weapon.id, 'critOn', parseInt(e.target.value) || 20)}
                            className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                            min="1"
                            max="20"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => removeWeapon(weapon.id)}
                            className={`p-1 ${weapons.length > 1 ? 'text-red-500 hover:text-red-700' : 'text-gray-400 cursor-not-allowed'}`}
                            title={weapons.length > 1 ? "Remove weapon" : "Cannot remove last weapon"}
                            disabled={weapons.length <= 1}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={13} className="px-2 py-2">
                          <button
                            onClick={() => rollAttack(weapon)}
                            className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                          >
                            Roll Attack
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'class-actions',
      title: 'Class Actions',
      icon: <FaStar className="text-yellow-600" />,
      content: (
        <div className="space-y-4">
          {/* Class Actions Table */}
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-medium text-gray-700">Class Actions</h5>
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              onClick={addClassAction}
            >
              <FaPlus />
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Action Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Gained From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Currently Used
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Max Uses
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classActions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={action.name}
                        onChange={(e) => updateClassAction(action.id, 'name', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="Action name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={action.description}
                        onChange={(e) => updateClassAction(action.id, 'description', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="Action description"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={action.gainedFrom}
                        onChange={(e) => updateClassAction(action.id, 'gainedFrom', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="e.g., Fighter Level 2"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={action.currentlyUsed}
                        onChange={(e) => updateClassAction(action.id, 'currentlyUsed', parseInt(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                        min="0"
                        max="999"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={action.maxUses}
                        onChange={(e) => updateClassAction(action.id, 'maxUses', parseInt(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                        min="0"
                        max="999"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeClassAction(action.id)}
                        className={`p-1 ${classActions.length > 1 ? 'text-red-500 hover:text-red-700' : 'text-gray-400 cursor-not-allowed'}`}
                        title={classActions.length > 1 ? "Remove action" : "Cannot remove last action"}
                        disabled={classActions.length <= 1}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Weapons/Class Actions</h3>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {section.icon}
                <h4 className="text-lg font-semibold text-gray-800">{section.title}</h4>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellsWeaponsTab; 