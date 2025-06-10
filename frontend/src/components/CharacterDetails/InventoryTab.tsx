import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Character } from '../../types/character';

interface InventoryTabProps {
  character: Character;
  apiUrl: string;
  onCharacterUpdated: (character: Character) => void;
}

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ character, apiUrl, onCharacterUpdated }) => {
  const [coins, setCoins] = useState({
    platinum: 0,
    gold: 0,
    electrum: 0,
    silver: 0,
    copper: 0
  });

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load inventory data from character
  useEffect(() => {
    setIsLoading(true);
    try {
      if (character.coins) {
        const loadedCoins = JSON.parse(character.coins);
        setCoins(loadedCoins);
      }
    } catch (error) {
      console.error('Error parsing coins:', error);
    }

    try {
      if (character.items) {
        const loadedItems = JSON.parse(character.items);
        if (loadedItems.length === 0) {
          // Initialize with one empty item if no items exist
          setItems([{
            id: Date.now().toString(),
            name: '',
            description: '',
            quantity: 1,
            weight: 0
          }]);
        } else {
          setItems(loadedItems);
        }
      }
    } catch (error) {
      console.error('Error parsing items:', error);
      // Initialize with one empty item if parsing fails
      setItems([{
        id: Date.now().toString(),
        name: '',
        description: '',
        quantity: 1,
        weight: 0
      }]);
    }
    setIsLoading(false);
  }, [character.id]); // Only run when character ID changes, not when character object is updated

  const totalCoins = coins.platinum + coins.gold + coins.electrum + coins.silver + coins.copper;
  const coinsWeight = totalCoins * 0.02; // 0.02 lbs per coin
  const itemsWeight = items.reduce((total, item) => total + (item.quantity * item.weight), 0);
  const totalWeight = itemsWeight + coinsWeight;
  const carryingCapacity = 15 * character.strength;
  const weightPercentage = Math.min((totalWeight / carryingCapacity) * 100, 100);

  const saveInventory = async () => {
    try {
      const inventoryData = {
        coins: JSON.stringify(coins),
        items: JSON.stringify(items)
      };

      const response = await axios.put(`${apiUrl}/api/characters/${character.id}/inventory`, inventoryData);
      onCharacterUpdated(response.data);
    } catch (error) {
      console.error('Error saving inventory:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error saving inventory: ${error.response.data}`);
      } else {
        alert('Error saving inventory. Please try again.');
      }
    }
  };

  const handleCoinChange = (coinType: keyof typeof coins, value: number) => {
    const newCoins = {
      ...coins,
      [coinType]: Math.max(0, Math.min(9999999, value))
    };
    setCoins(newCoins);
    
    // Auto-save after a short delay, but only if not loading
    if (!isLoading) {
      setTimeout(() => {
        const inventoryData = {
          coins: JSON.stringify(newCoins),
          items: JSON.stringify(items)
        };
        axios.put(`${apiUrl}/api/characters/${character.id}/inventory`, inventoryData)
          .then(response => onCharacterUpdated(response.data))
          .catch(error => console.error('Error auto-saving coins:', error));
      }, 1000);
    }
  };

  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      weight: 0
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    
    // Auto-save, but only if not loading
    if (!isLoading) {
      setTimeout(() => {
        const inventoryData = {
          coins: JSON.stringify(coins),
          items: JSON.stringify(newItems)
        };
        axios.put(`${apiUrl}/api/characters/${character.id}/inventory`, inventoryData)
          .then(response => onCharacterUpdated(response.data))
          .catch(error => console.error('Error auto-saving items:', error));
      }, 1000);
    }
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      
      // Auto-save, but only if not loading
      if (!isLoading) {
        setTimeout(() => {
          const inventoryData = {
            coins: JSON.stringify(coins),
            items: JSON.stringify(newItems)
          };
          axios.put(`${apiUrl}/api/characters/${character.id}/inventory`, inventoryData)
            .then(response => onCharacterUpdated(response.data))
            .catch(error => console.error('Error auto-saving items:', error));
        }, 1000);
      }
    }
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(newItems);
    
    // Auto-save after a short delay, but only if not loading
    if (!isLoading) {
      setTimeout(() => {
        const inventoryData = {
          coins: JSON.stringify(coins),
          items: JSON.stringify(newItems)
        };
        axios.put(`${apiUrl}/api/characters/${character.id}/inventory`, inventoryData)
          .then(response => onCharacterUpdated(response.data))
          .catch(error => console.error('Error auto-saving items:', error));
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Inventory</h3>
      </div>

      {/* Total Weight Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Total Weight</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Current Weight:</span>
            <span className="font-medium">{totalWeight.toFixed(2)} lbs</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Carrying Capacity:</span>
            <span className="font-medium">{carryingCapacity} lbs</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Coins: {coinsWeight.toFixed(2)} lbs </span>
            <span className="text-xs text-gray-500">Items: {itemsWeight.toFixed(2)} lbs</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                weightPercentage > 100 ? 'bg-red-600' : 
                weightPercentage > 80 ? 'bg-yellow-600' : 'bg-blue-600'
              }`} 
              style={{ width: `${weightPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Coins Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Coins</h4>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <input
              type="number"
              value={coins.platinum}
              onChange={(e) => handleCoinChange('platinum', parseInt(e.target.value) || 0)}
              className="w-full text-center text-lg font-semibold text-purple-600 bg-transparent border-none focus:outline-none"
              placeholder="0"
              min="0"
              max="9999999"
              maxLength={7}
            />
            <div className="text-xs text-gray-500">Platinum</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <input
              type="number"
              value={coins.gold}
              onChange={(e) => handleCoinChange('gold', parseInt(e.target.value) || 0)}
              className="w-full text-center text-lg font-semibold text-yellow-600 bg-transparent border-none focus:outline-none"
              placeholder="0"
              min="0"
              max="9999999"
              maxLength={7}
            />
            <div className="text-xs text-gray-500">Gold</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <input
              type="number"
              value={coins.electrum}
              onChange={(e) => handleCoinChange('electrum', parseInt(e.target.value) || 0)}
              className="w-full text-center text-lg font-semibold text-yellow-500 bg-transparent border-none focus:outline-none"
              placeholder="0"
              min="0"
              max="9999999"
              maxLength={7}
            />
            <div className="text-xs text-gray-500">Electrum</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <input
              type="number"
              value={coins.silver}
              onChange={(e) => handleCoinChange('silver', parseInt(e.target.value) || 0)}
              className="w-full text-center text-lg font-semibold text-gray-600 bg-transparent border-none focus:outline-none"
              placeholder="0"
              min="0"
              max="9999999"
              maxLength={7}
            />
            <div className="text-xs text-gray-500">Silver</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <input
              type="number"
              value={coins.copper}
              onChange={(e) => handleCoinChange('copper', parseInt(e.target.value) || 0)}
              className="w-full text-center text-lg font-semibold text-yellow-800 bg-transparent border-none focus:outline-none"
              placeholder="0"
              min="0"
              max="9999999"
              maxLength={7}
            />
            <div className="text-xs text-gray-500">Copper</div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-800">Items</h4>
          <button
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
            onClick={addItem}
          >
            <FaPlus />
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Weight (lbs)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                      min="0"
                      max="999"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                      placeholder="Item name"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {(item.quantity * item.weight).toFixed(2)} lbs
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeItem(item.id)}
                      className={`p-1 ${items.length > 1 ? 'text-red-500 hover:text-red-700' : 'text-gray-400 cursor-not-allowed'}`}
                      title={items.length > 1 ? "Remove item" : "Cannot remove last item"}
                      disabled={items.length <= 1}
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
    </div>
  );
};

export default InventoryTab; 