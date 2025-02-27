import { useEffect, useState } from "react";
import { fetchAllUsers } from "../utils/fetchdetails";
import AddBrokerForm from "../pages/AddBrokerForm";
import UserAdd from "../pages/Useradd";
import {PnLView} from "../pages/P&Lshow"
import { BrokerView } from "../pages/BrokerViewAdmin";
import { endpoints } from "../utils/apis";
const {BROKER_DATA_API} = endpoints;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState(null); // "broker" or "pnl"
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [isAddingBroker, setIsAddingBroker] = useState(false);
  const [showUserAdd, setShowUserAdd] = useState(false); // New state for UserAdd visibility
  const [highlightedUser, setHighlightedUser] = useState(null); // State to track highlighted user
  const [showAddBrokerOptions, setShowAddBrokerOptions] = useState(false); // State to show add broker options
  const [selectedBrokerForForm, setSelectedBrokerForForm] = useState(null); // New state to store the selected broker for the form
  const [brokerData, setBrokerData] = useState(null); // State to store fetched broker data
  useEffect(() => {
    async function fetchUsers() {
      const usersList = await fetchAllUsers();
      setUsers(usersList);
    }
    fetchUsers();
  }, []);

  // Fetch broker data when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const fetchBrokerData = async () => {
        try {
          const URL = `${BROKER_DATA_API}${selectedUser.gmail}`;
          
          const response = await fetch(
            URL
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch broker data");
          }
  
          const data = await response.json();
  
          setBrokerData(data); // Store fetched broker data
        } catch (error) {
          console.error("Error fetching broker data:", error);
          setBrokerData(null); // Reset data on error
        }
      };
  
      fetchBrokerData();
    }
  }, [selectedUser]); // Re-run when selectedUser changes
  
  // Updated userAddHandler to toggle the visibility of UserAdd
  function userAddHandler(e) {
    e.preventDefault();
    setShowUserAdd(!showUserAdd); // Toggle the state
  }

  // Function to handle user click and highlight
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setView(null);
    setSelectedBroker(null);
    setHighlightedUser(user._id); // Set the highlighted user ID
  };

  // Add this function to refresh users
  const refreshUsers = async () => {
    const usersList = await fetchAllUsers();
    setUsers(usersList);
  };

  // Function to handle adding user to a broker
  const handleAddBroker = (broker) => {
    setSelectedBrokerForForm(broker); // Set the selected broker for the form
    setIsAddingBroker(true); // Show the AddBrokerForm
    setShowAddBrokerOptions(false); // Hide the add broker options after selection
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold bg-blue-500 p-2 rounded-lg flex items-center text-white">
        Admin Dashboard
      </h2>
      <button
        onClick={userAddHandler}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        New User Registration
      </button>

      {/* Conditionally render the UserAdd component */}
      {showUserAdd && <UserAdd onCancel={() => setShowUserAdd(false)} />}
      <p className="mb-4 mt-6 text-lg font-bold bg-blue-200 rounded-lg flex justify-center p-1">List of all registered users:</p>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-2">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className={`border p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                highlightedUser === user._id ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex justify-between">
                <p className="font-bold">{user.username}</p>
                <p className="mr-30">Email: {user.gmail}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* User Details */}
      {selectedUser && (
        <div className="mt-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">User: {selectedUser.username}</h3>
            <button
              className="text-red-500 font-bold"
              onClick={() => setSelectedUser(null)}
            >
              X
            </button>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={() => setView("broker")}
            >
              Broker
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              onClick={() => setView("pnl")}
            >
              P&L
            </button>
          </div>

          {/* Broker List */}
          {view === "broker" && (
            <BrokerView
            user={selectedUser}
            brokerData={brokerData}
            setIsAddingBroker={setIsAddingBroker}
            setSelectedBroker={setSelectedBroker}
            showAddBrokerOptions={showAddBrokerOptions}
            setShowAddBrokerOptions={setShowAddBrokerOptions}
            handleAddBroker={handleAddBroker}
          />
          )}

          {/* Profit & Loss View */}
          {view === "pnl" && (
            <PnLView
              user={selectedUser.gmail}
              selectedBroker={selectedBroker}
              setSelectedBroker={setSelectedBroker}
            />
          )}
        </div>
      )}

      {/* Add Broker Form */}
      {isAddingBroker && (
        <AddBrokerForm
          setIsAddingBroker={setIsAddingBroker}
          selectedBroker={selectedBrokerForForm}
          refreshUsers={refreshUsers}
          user={selectedUser.gmail}
          onCancel={() => {
            setSelectedBrokerForForm(null);
            setIsAddingBroker(false);
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;