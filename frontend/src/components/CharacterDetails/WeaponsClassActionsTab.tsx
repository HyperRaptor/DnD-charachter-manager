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

const SpellsWeaponsTab: React.FC<SpellsWeaponsTabProps> = ({ character, apiUrl, onCharacterUpdated }) => {
  const [classActions, setClassActions] = useState<ClassAction[]>([]);
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
          <div className="text-center py-8 text-gray-500">
            <FaCrosshairs className="text-4xl mx-auto mb-4 text-red-300" />
            <p>Weapons functionality coming soon...</p>
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