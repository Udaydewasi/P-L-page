import { useEffect, useState } from "react";
import { fetchUserByEmail } from "../utils/fetchdetails";
import { endpoints } from "../utils/apis";
import { PnLView } from "../pages/P&Lshow";
import { BrokerView } from "../pages/BrokerViewUser";

const {BROKER_DATA_API} = endpoints;

function UserDashboard() {
  const [brokerData, setBrokerData] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [view, setView] = useState(null);
  const user_email = localStorage.getItem("email");


  useEffect(() => {
    async function fetchUser() {
      try{const URL = `${BROKER_DATA_API}${user_email}`;
      const response = await fetch(URL);

      if(!response.ok){
        throw new Error("Failed to fetch broker data");
      }
      const data = await response.json();
      console.log("brokerData", data);
      setBrokerData(data);
      }catch(e){

      }
  }
    fetchUser();
  }, []);

  return (
    <div className="p-6">
      {brokerData ? (
        <>
          <h2 className="text-2xl font-bold">Welcome, {brokerData.username}</h2>
          {(
                  <div className="mt-6 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">User: {user_email}</h3>
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
                      user={user_email}
                      brokerData={brokerData}
                      setSelectedBroker={setSelectedBroker}
                    />
                    )}
          
                    {/* Profit & Loss View */}
                    {view === "pnl" && (
                      <PnLView
                        user={user_email}
                        selectedBroker={selectedBroker}
                        setSelectedBroker={setSelectedBroker}
                      />
                    )}
                  </div>
                )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserDashboard;
