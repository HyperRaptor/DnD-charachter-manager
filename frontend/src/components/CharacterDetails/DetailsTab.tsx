import React, { useState, useEffect } from 'react';
import { Character } from '../../types/character';

interface DetailsTabProps {
  character: Character;
  apiUrl: string;
  onCharacterUpdated: (character: Character) => void;
}

interface DetailsData {
  background: string;
  classFeatures: string;
  speciesFeatures: string;
  otherFeatures: string;
  notes: string;
  connections: string;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ character, apiUrl, onCharacterUpdated }) => {
  const [details, setDetails] = useState<DetailsData>({
    background: '',
    classFeatures: '',
    speciesFeatures: '',
    otherFeatures: '',
    notes: '',
    connections: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load details data from character
  useEffect(() => {
    setIsLoading(true);
    try {
      if (character.details) {
        const loadedDetails = JSON.parse(character.details);
        setDetails(loadedDetails);
      }
    } catch (error) {
      console.error('Error parsing details:', error);
    }
    setIsLoading(false);
  }, [character.id]);

  const handleFieldChange = (field: keyof DetailsData, value: string) => {
    const newDetails = {
      ...details,
      [field]: value
    };
    setDetails(newDetails);
    
    // Auto-save after a short delay, but only if not loading
    if (!isLoading) {
      setTimeout(() => {
        const detailsData = {
          details: JSON.stringify(newDetails)
        };
        fetch(`${apiUrl}/api/characters/${character.id}/details`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(detailsData)
        })
          .then(response => response.json())
          .then(updatedCharacter => onCharacterUpdated(updatedCharacter))
          .catch(error => console.error('Error auto-saving details:', error));
      }, 1000);
    }
  };

  const textAreaClass = "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Character Details</h3>
      </div>

      <div className="space-y-6">
        {/* Background */}
        <div>
          <label className={labelClass}>Background</label>
          <textarea
            value={details.background}
            onChange={(e) => handleFieldChange('background', e.target.value)}
            className={textAreaClass}
            rows={4}
            placeholder=""
          />
        </div>

        {/* Class Features */}
        <div>
          <label className={labelClass}>Class Features</label>
          <textarea
            value={details.classFeatures}
            onChange={(e) => handleFieldChange('classFeatures', e.target.value)}
            className={textAreaClass}
            rows={4}
            placeholder=""
          />
        </div>

        {/* Species Features */}
        <div>
          <label className={labelClass}>Species Features</label>
          <textarea
            value={details.speciesFeatures}
            onChange={(e) => handleFieldChange('speciesFeatures', e.target.value)}
            className={textAreaClass}
            rows={4}
            placeholder=""
          />
        </div>

        {/* Other Features */}
        <div>
          <label className={labelClass}>Other Features</label>
          <textarea
            value={details.otherFeatures}
            onChange={(e) => handleFieldChange('otherFeatures', e.target.value)}
            className={textAreaClass}
            rows={4}
            placeholder=""
          />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={details.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            className={textAreaClass}
            rows={4}
            placeholder=""
          />
        </div>

        {/* Connections */}
        <div>
          <label className={labelClass}>Connections</label>
          <textarea
            value={details.connections}
            onChange={(e) => handleFieldChange('connections', e.target.value)}
            className={textAreaClass}
            rows={4}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsTab; 