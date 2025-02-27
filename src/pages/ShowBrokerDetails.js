import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { handleEditBrokerSubmit } from './edit&deleteBroker';

export function BrokerDetailsModal({ brokerDetails, onClose, broker, gmail, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [isModified, setIsModified] = useState(false);
  useEffect(() => {
    if (brokerDetails && Array.isArray(brokerDetails) && brokerDetails.length > 0) {
      // Get the first object from the array
      const detailsObject = brokerDetails[0];
      // Initialize form data with all fields from the first object
      const initialData = Object.keys(detailsObject).reduce((acc, key) => {
        acc[key] = detailsObject[key]?.toString() || '';
        return acc;
      }, {});
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [brokerDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check if any field is modified from original value
    const hasChanges = Object.keys(originalData).some(key => 
      originalData[key] !== (name === key ? value : formData[key])
    );
    setIsModified(hasChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const detailsObject = brokerDetails[0];
      // Only send modified fields
      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          // Convert back to number if the original value was a number
          changedFields[key] = typeof detailsObject[key] === 'number' 
            ? Number(formData[key])
            : formData[key];
        }
      });

      await handleEditBrokerSubmit(gmail, broker, changedFields);
      setIsEditing(false);
      setIsModified(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update broker:', error);
    }
  };

  const getInputType = (key) => {
    const detailsObject = brokerDetails[0];
    return 'text';
  };

  const formatFieldLabel = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!brokerDetails || !Array.isArray(brokerDetails) || brokerDetails.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-3/5 bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">
            {broker} Details
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 hover:text-blue-700 p-2"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {formatFieldLabel(key)}
              </label>
              <input
                type={getInputType(key)}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`p-2 border rounded-md ${
                  isEditing 
                    ? 'border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>
          ))}

          {isEditing && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData(originalData);
                  setIsEditing(false);
                  setIsModified(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isModified}
                className={`px-4 py-2 rounded ${
                  isModified
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BrokerDetailsModal;