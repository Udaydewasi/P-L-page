import { MdDelete, MdCheck } from "react-icons/md"; // Import MdCheck for the green checkmark
import React, { useState, useEffect } from "react";
import { getBrokerDetails } from "../utils/fetchdetails";
import { BrokerDetailsModal } from "../pages/ShowBrokerDetails";
import { deleteBroker } from "./edit&deleteBroker";
import { endpoints } from "../utils/apis";
const { BROKER_TEST_API, TEST_VISIBLE_API } = endpoints;

export function BrokerView({
  user,
  brokerData,
  showAddBrokerOptions,
  setShowAddBrokerOptions,
  handleAddBroker,
  refreshBrokerData,
}) {
  const broker = "upstox"; // Only one broker is available
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedBroker, setBroker] = useState(null);
  const [testStatus, setTestStatus] = useState(null); // Test status for the broker
  const [isTesting, setIsTesting] = useState(false); // To track if testing is in progress

  const isBrokerConnected = brokerData && brokerData[broker] && brokerData[broker].length > 0;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteBroker = async () => {
    if (confirmDelete) {
      try {
        await deleteBroker(user.gmail, broker);
        setShowDeleteModal(false);
        setConfirmDelete(false);

        // Refresh broker data after deletion
        await refreshBrokerData();
      } catch (error) {
        console.error("Error deleting broker:", error);
      }
    }
  };

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBrokerDetails, setSelectedBrokerDetails] = useState(null);

  const handleAddDetail = async () => {
    try {
      setBroker(broker);
      const details = await getBrokerDetails(user.gmail, broker);
      setSelectedBrokerDetails(details);

      // Fetch test status for the broker
      const status = await test_status();
      setTestStatus(status);

      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching broker details:", error);
    }
  };

  const handleTest = async () => {
    try {
      // Show "Testing..." while the test is in progress
      setIsTesting(true);

      const response = await fetch(`${BROKER_TEST_API}?gmail=${user.gmail}&broker=${broker}`);
      const data = await response.json();
      alert(data["message"]);

      // Refresh the test status after the test is completed
      const status = await test_status();
      setTestStatus(status);
      setIsTesting(false);

      // Refresh broker data if the test is successful
      if (data["status"] === "success") {
        await refreshBrokerData();
      }
    } catch (error) {
      console.error("Error testing broker:", error);
      setTestStatus(false);
      setIsTesting(false);
    }
  };

  const test_status = async () => {
    const response = await fetch(`${TEST_VISIBLE_API}?gmail=${user.gmail}&broker=${broker}`);
    const data = await response.json();
    console.log("data is ;", data)
    return data;
  };

  // Fetch test status when the component mounts
  useEffect(() => {
    const fetchTestStatus = async () => {
      const status = await test_status();
      setTestStatus(status);
    };

    if (isBrokerConnected) {
      fetchTestStatus();
    }
  }, [isBrokerConnected]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Connected Brokers:</h3>
      <div className="grid grid-cols-2 gap-2">
        {isBrokerConnected ? (
          <div className="border rounded-lg flex items-center justify-between bg-white shadow-md">
            <div
              className="w-9/12 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
              onClick={handleAddDetail}
            >
              <span className="font-bold text-gray-800">
                {broker.charAt(0).toUpperCase() + broker.slice(1)}
              </span>
            </div>
            <div className="flex space-x-2 p-1">
              {isTesting ? (
                <span className="max-w-[6rem] text-white bg-blue-500 border rounded-lg p-2">
                  Testing...
                </span>
              ) : testStatus === "true" ? (
                <span className="max-w-[6rem] text-green-600 border rounded-lg p-2">
                  <MdCheck size={24} /> {/* Green checkmark */}
                </span>
              ) : (
                <button
                  className="max-w-[6rem] text-white bg-blue-500 hover:bg-blue-600 border rounded-lg p-2"
                  onClick={handleTest}
                >
                  Test
                </button>
              )}
              <button
                onClick={handleDeleteClick}
                className="text-red-700 hover:bg-red-700 hover:text-white border rounded-lg bg-red-300 p-2 transition"
                title="Delete"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-400 col-span-2 text-center">No brokers connected.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Delete Broker
            </h3>
            <p className="mb-4">
              Are you sure you want to delete {broker}? This action cannot be undone.
            </p>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="confirmDelete"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="confirmDelete" className="text-sm text-red-600">
                Yes, I want to delete this broker
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmDelete(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBroker}
                disabled={!confirmDelete}
                className={`px-4 py-2 rounded ${
                  confirmDelete
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Broker Section */}
      {!isBrokerConnected && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => setShowAddBrokerOptions(!showAddBrokerOptions)}
        >
          + Add Broker
        </button>
      )}

      {showAddBrokerOptions && !isBrokerConnected && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Add Broker to User:</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div
              className="border p-3 rounded-lg cursor-pointer flex justify-between items-center"
              onClick={() => handleAddBroker(broker)}
            >
              <p className="font-bold">
                {broker.charAt(0).toUpperCase() + broker.slice(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedBrokerDetails && (
        <BrokerDetailsModal
          brokerDetails={selectedBrokerDetails}
          onClose={() => setShowDetailsModal(false)}
          broker={selectedBroker}
          gmail={user.gmail}
          onUpdate={() => {
            handleAddDetail();
            refreshBrokerData(); // Refresh broker data after update
          }}
        />
      )}
    </div>
  );
}