import React, { useState, useEffect } from "react";

const EditDeleteComponent = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [editingId, setEditingId] = useState(null); // State to track which item is being edited
  const [editFormData, setEditFormData] = useState({}); // State to store edited data

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "POST",
      });
      setData(data.filter((item) => item.id !== id)); // Remove deleted item from state
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle edit action
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditFormData(item);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Save edited data
  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );
      const updatedItem = await response.json();

      // Update the data state with the edited item
      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, ...updatedItem } : item
        )
      );

      setEditingId(null); // Exit edit mode
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">ID</th>
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">Email</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="p-2 border border-gray-300">{item.id}</td>
              <td className="p-2 border border-gray-300">
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="p-2 border border-gray-300">
                {editingId === item.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  item.email
                )}
              </td>
              <td className="p-2 border border-gray-300">
                {editingId === item.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditDeleteComponent;