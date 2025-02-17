import { useEffect, useState } from "react";
import { fetchUserByEmail } from "../utils/fetchdetails";

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    async function fetchUser() {
      const user = await fetchUserByEmail(email);
      setUserData(user);
    }
    fetchUser();
  }, []);

  return (
    <div className="p-6">
      {userData ? (
        <>
          <h2 className="text-2xl font-bold">Welcome, {userData.username}</h2>
          <PnLView user={userData} selectedBroker={selectedBroker} setSelectedBroker={setSelectedBroker} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function PnLView({ user, selectedBroker, setSelectedBroker }) {
  const tradeSummaries = user.upstox.map((broker, index) => ({ index, name: `Broker ${index + 1}`, data: broker.trade_summary }));

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Select Broker for P&L:</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {tradeSummaries.map((broker) => (
          <div key={broker.index} className="border p-3 rounded-lg cursor-pointer" onClick={() => setSelectedBroker(broker)}>
            {broker.name}
          </div>
        ))}
        <div className="border p-3 rounded-lg cursor-pointer bg-gray-200" onClick={() => setSelectedBroker("all")}>
          Show All
        </div>
      </div> 

      {selectedBroker && <PnLTable selectedBroker={selectedBroker === "all" ? tradeSummaries : [selectedBroker]} />}
    </div>
  );
}

function PnLTable({ selectedBroker }) {
  const monthlyPnL = {};

  selectedBroker.forEach(({ data }) => {
    Object.entries(data).forEach(([date, summary]) => {
      const [day, month, year] = date.split("-");
      const monthKey = `${year}-${month.padStart(2, "0")}`;

      if (!monthlyPnL[monthKey]) {
        monthlyPnL[monthKey] = {};
      }
      monthlyPnL[monthKey][day] = summary.total_pl;
    });
  });

  const sortedMonths = Object.keys(monthlyPnL).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Monthly P&L</h3>
      <div className="space-y-6">
        {sortedMonths.map((month) => {
          const daysInMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

          return (
            <div key={month} className="p-4 border rounded-lg bg-gray-100">
              <h4 className="text-xl font-bold mb-2">{month}</h4>
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                  const totalPl = monthlyPnL[month][day];
                  return (
                    <div key={day} className={`p-1 border text-center ${totalPl ? (totalPl > 0 ? "text-green-500" : "text-red-500") : "text-gray-400"}`}>
                      <p className="font-bold">{day}</p>
                      <p>{totalPl ? (totalPl > 0 ? `+₹${totalPl}` : `-₹${Math.abs(totalPl)}`) : "-"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserDashboard;
