import React, { useEffect, useState } from "react";
import { endpoints } from "../utils/apis";

const { BROKER_FORM_DETAIL_API, BROKER_FORM_SUBMIT_API } = endpoints;

const AddBrokerForm = ({ setIsAddingBroker, selectedBroker, refreshUsers, user, onCancel }) => {
  const [formFields, setFormFields] = useState([]); // State to store form fields from API
  const [formData, setFormData] = useState({}); // State to store form data
  const [error, setError] = useState(""); // State to handle errors

  // Fetch form fields from API based on the selected broker
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const response = await fetch(BROKER_FORM_DETAIL_API);
        if (!response.ok) {
          throw new Error("Failed to fetch form fields");
        }
        const data = await response.json();
        console.log("API Response:", data);
 
        // Extract fields for the selected broker
        if (data[selectedBroker]) {
          setFormFields(
            data[selectedBroker].map((fieldName) => ({
              name: fieldName,
              label: fieldName.replace(/_/g, " ").toUpperCase(),
              type: "text", // Default type, you can customize this based on your needs
              required: true, // Default to required, you can customize this
            }))
          );
        } else {
          throw new Error(`No form fields found for broker: ${selectedBroker}`);
        }
      } catch (error) {
        setError("Error fetching form fields. Please try again.");
        console.error(error);
      }
    };

    if (selectedBroker) {
      fetchFormFields();
    }
  }, [selectedBroker]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(BROKER_FORM_SUBMIT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, broker: selectedBroker, gmail:user}),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      // Reset form and show success message
      setFormData({});
      setIsAddingBroker(false); // Close the form after submission
      await refreshUsers(); // Refresh the user list
      alert("Form submitted successfully!");
    } catch (error) {
      setError("Error submitting form data. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add {selectedBroker?.toUpperCase()} Broker
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}:
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-red-400 text-gray-700 py-2 px-4 rounded-md hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrokerForm;