import React from 'react';
import { Character, Skill } from '../../types/character';
import { FaDiceD20 } from 'react-icons/fa';

interface SkillsTabProps {
  character: Character;
  onSkillChange?: (skillName: string, field: 'proficiency' | 'other', value: string | number) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ character, onSkillChange }) => {
  // D&D 5e skills organized by ability
  const skillGroups = [
    {
      ability: 'Strength',
      abilityAbbr: 'STR',
      abilityModifier: character.strengthModifier,
      skills: ['Athletics']
    },
    {
      ability: 'Dexterity',
      abilityAbbr: 'DEX',
      abilityModifier: character.dexterityModifier,
      skills: ['Acrobatics', 'Sleight of Hand', 'Stealth']
    },
    {
      ability: 'Intelligence',
      abilityAbbr: 'INT',
      abilityModifier: character.intelligenceModifier,
      skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion']
    },
    {
      ability: 'Wisdom',
      abilityAbbr: 'WIS',
      abilityModifier: character.wisdomModifier,
      skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival']
    },
    {
      ability: 'Charisma',
      abilityAbbr: 'CHA',
      abilityModifier: character.charismaModifier,
      skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion']
    }
  ];

  // Get skill data or create default
  const getSkillData = (skillName: string): Skill => {
    // Parse skills from backend JSON string or use empty array
    let skillsArray: Skill[] = [];
    if (character.skills) {
      try {
        skillsArray = typeof character.skills === 'string' ? JSON.parse(character.skills) : character.skills;
      } catch (e) {
        console.error('Error parsing skills:', e);
        skillsArray = [];
      }
    }
    
    const existingSkill = skillsArray.find(s => s.name === skillName);
    return existingSkill || {
      name: skillName,
      ability: skillGroups.find(group => group.skills.includes(skillName))?.ability || '',
      proficiency: 'none',
      other: 0
    };
  };

  // Calculate proficiency bonus (simplified - you might want to make this more sophisticated)
  const getProficiencyBonus = () => {
    return Math.floor((character.level - 1) / 4) + 2;
  };

  // Calculate proficiency modifier based on proficiency type
  const getProficiencyModifier = (proficiency: string) => {
    const baseProficiencyBonus = getProficiencyBonus();
    switch (proficiency) {
      case 'proficient':
        return baseProficiencyBonus;
      case 'expertise':
        return baseProficiencyBonus * 2;
      case 'jack-of-all-trades':
        return Math.floor(baseProficiencyBonus / 2);
      default:
        return 0;
    }
  };

  // Calculate total skill modifier
  const getSkillTotal = (skillName: string) => {
    const skill = getSkillData(skillName);
    const group = skillGroups.find(g => g.skills.includes(skillName));
    const abilityModifier = group?.abilityModifier || 0;
    const proficiencyModifier = getProficiencyModifier(skill.proficiency);
    return abilityModifier + proficiencyModifier + skill.other;
  };

  // Calculate passive score
  const getPassiveScore = (skillName: string) => {
    return getSkillTotal(skillName) + 10;
  };

  const handleProficiencyChange = (skillName: string, proficiency: string) => {
    if (onSkillChange) {
      onSkillChange(skillName, 'proficiency', proficiency);
    }
  };

  const handleOtherChange = (skillName: string, other: number) => {
    if (onSkillChange) {
      onSkillChange(skillName, 'other', other);
    }
  };

  // Handle skill roll
  const handleSkillRoll = (skillName: string) => {
    const total = getSkillTotal(skillName);
    const roll = Math.floor(Math.random() * 20) + 1;
    const result = roll + total;
    
    const group = skillGroups.find(g => g.skills.includes(skillName));
    const abilityAbbr = group?.abilityAbbr || '';
    
    alert(`${skillName} (${abilityAbbr}) Check:\nRoll: ${roll}\nModifier: ${total >= 0 ? '+' : ''}${total}\nTotal: ${result}`);
  };

  // Get all skills for the table
  const allSkills = skillGroups.flatMap(group => 
    group.skills.map(skillName => ({
      ...getSkillData(skillName),
      abilityModifier: group.abilityModifier,
      ability: group.ability,
      abilityAbbr: group.abilityAbbr
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills</h3>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Roll
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Skill
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Ability Mod
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Proficiency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Other
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Passive
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allSkills.map((skill) => {
              const total = getSkillTotal(skill.name);
              const passive = getPassiveScore(skill.name);
              
              return (
                <tr key={skill.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSkillRoll(skill.name)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                      title={`Roll ${skill.name} check`}
                    >
                      <FaDiceD20 className="text-sm" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm text-gray-800">
                      {skill.name}({skill.abilityAbbr})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {skill.abilityModifier >= 0 ? '+' : ''}{skill.abilityModifier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={skill.proficiency}
                      onChange={(e) => handleProficiencyChange(skill.name, e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                      title={`Select proficiency level for ${skill.name}`}
                    >
                      <option value="none">None</option>
                      <option value="proficient">Proficient (+{getProficiencyBonus()})</option>
                      <option value="expertise">Expertise (+{getProficiencyBonus() * 2})</option>
                      <option value="jack-of-all-trades">Jack of All Trades (+{Math.floor(getProficiencyBonus() / 2)})</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={skill.other}
                      onChange={(e) => handleOtherChange(skill.name, parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {total >= 0 ? '+' : ''}{total}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {passive}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillsTab; 