import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import React, { useState } from "react";
import { GiMailShirt } from "react-icons/gi";
import {getBrokerDetails} from "../utils/fetchdetails"
import {BrokerDetailsModal} from "../pages/ShowBrokerDetails"
import { deleteBroker } from "./edit&deleteBroker";

export function BrokerView({
  user,
  brokerData,
  showAddBrokerOptions,
  setShowAddBrokerOptions,
  handleAddBroker,
  onDeleteBroker
}) {
  const brokers = ["upstox", "zerodha", "angle_one", "grow"];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brokerToDelete, setBrokerToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedBroker, setBroker] = useState(null);


  const connectedBrokers = brokerData
    ? brokers.filter((broker) => brokerData[broker] && brokerData[broker].length > 0)
    : [];

  const availableBrokers = brokerData
    ? brokers.filter((broker) => !brokerData[broker] || brokerData[broker].length === 0)
    : brokers;

  const handleDeleteClick = (broker) => {
    setBrokerToDelete(broker);
    setShowDeleteModal(true);
  };

  const confirmDeleteBroker = async () => {
    if (confirmDelete && brokerToDelete) {
      try {
        await deleteBroker(user.gmail, brokerToDelete);
        setShowDeleteModal(false);
        setConfirmDelete(false);
      } catch (error) {
        console.error("Error deleting broker:", error);
      }
    }
  };

const [showDetailsModal, setShowDetailsModal] = useState(false);
const [selectedBrokerDetails, setSelectedBrokerDetails] = useState(null);

const handleAddDetail = async (broker) => {
  try {
    setBroker(broker);
    const details = await getBrokerDetails(user.gmail, broker);
    setSelectedBrokerDetails(details);
    setShowDetailsModal(true);
  } catch (error) {
    console.error("Error fetching broker details:", error);
  }
};
  

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Connected Brokers:</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {connectedBrokers.length > 0 ? (
          connectedBrokers.map((broker) => (
            <div className="border rounded-lg flex justify-between items-center">
              <div
                key={broker}
                className="w-11/12 rounded-lg p-2 cursor-pointer hover:bg-gray-400"
                onClick={()=> handleAddDetail(broker)}
              >
                <span className="font-bold">
                  {broker.charAt(0).toUpperCase() + broker.slice(1)}
                  {/* onClick={() => handleBrokerDetails(gmail)} */}
                </span>
          
              </div>
                  <button
                    onClick={() => handleDeleteClick(broker)}
                    className="text-red-700 hover:bg-red-700 border rounded-lg bg-red-300 p-2"
                    title="Delete"
                  >
                    <MdDelete />
                  </button>
            </div>
          ))
        ) : (
          <p className="text-red-400">No brokers connected.</p>
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
              Are you sure you want to delete {brokerToDelete}? This action cannot be undone.
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
      {availableBrokers.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => setShowAddBrokerOptions(!showAddBrokerOptions)}
        >
          + Add Broker
        </button>
      )}

      {showAddBrokerOptions && availableBrokers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Add Broker to User:</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableBrokers.map((broker) => (
              <div
                key={broker}
                className="border p-3 rounded-lg cursor-pointer flex justify-between items-center"
                onClick={() => handleAddBroker(broker)}
              >
                <p className="font-bold">
                  {broker.charAt(0).toUpperCase() + broker.slice(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDetailsModal && selectedBrokerDetails && (
        <BrokerDetailsModal
          brokerDetails={selectedBrokerDetails}
          onClose={() => setShowDetailsModal(false)}
          broker={selectedBroker}
          gmail={user.gmail}
          onUpdate={() => handleAddDetail(selectedBrokerDetails.broker)}
        />
      )}
    </div>
  );
}