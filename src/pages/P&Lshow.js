import React, { useEffect, useState } from "react";
import {endpoints} from '../utils/apis';
const {ALL_TRADE_HISTORY_API, BROKER_DATA_API} = endpoints;

export function PnLView({ user, selectedBroker, setSelectedBroker }) {
  const [brokerData, setBrokerData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const fetchBrokerData = async () => {
        try {
          const URL = `${BROKER_DATA_API}${user}`;
          const response = await fetch(URL);

          if (!response.ok) {
            throw new Error("Failed to fetch broker data");
          }

          const data = await response.json();
          setBrokerData(data); // Store fetched data
          setError(""); // Clear any previous errors
        } catch (error) {
          console.error("Error fetching broker data:", error);
          setError("Failed to fetch broker data. Please try again.");
          setBrokerData(null); // Reset data on error
        }
      };

      fetchBrokerData();
    }
  }, [user]); // Fetch only when `user` changes

  // Extract trade summaries from brokerData
  const tradeSummaries = [];

  if (brokerData) {
    ["upstox"].forEach((broker) => {
      const trades = brokerData[broker];
      if (Array.isArray(trades)) {
        trades.forEach((b, index) => {
          if (b.trade_summary) {
            tradeSummaries.push({
              index,
              name: `${broker.charAt(0).toUpperCase() + broker.slice(1)}`,
              data: b.trade_summary,
            });
          }
        });
      } else {
        console.warn(`Skipping ${broker} as it's not an array:`, trades);
      }
    });
  }

  const fetchAllTradeHistory = async () => {
    try {
      const URL = `${ALL_TRADE_HISTORY_API}${user}`;
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("Failed to fetch all trade history");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching all trade history:", error);
      setError("Failed to fetch all trade history. Please try again.");
      return null;
    }
  };

  const handleShowAll = async () => {
    const allTradeHistoryResponse = await fetchAllTradeHistory();

    if (allTradeHistoryResponse && allTradeHistoryResponse.length > 0) {
      const allTradeHistory = allTradeHistoryResponse[0].all_trade_history;
      const aggregatedData = {
        name: "All Brokers",
        data: allTradeHistory,
        isAggregated: true
      };
      setSelectedBroker([aggregatedData]);
    } else {
      setError("No trade history data found.");
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <h3 className="text-lg font-semibold">Select Broker for P&L:</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {tradeSummaries.map((broker) => (
          <div
            key={broker.index}
            className="border p-3 rounded-lg cursor-pointer"
            onClick={() => setSelectedBroker([{...broker, isAggregated: false}])}
          >
            {broker.name}
          </div>
        ))}
        <div
          className="border p-3 rounded-lg cursor-pointer bg-gray-200"
          onClick={handleShowAll}
        >
          Show All
        </div>
      </div>

      {selectedBroker && (
        <PnLTable 
          key={selectedBroker[0]?.isAggregated ? 'aggregated' : selectedBroker.map(b => b.name).join('-')}
          selectedBroker={selectedBroker} 
        />
      )}
    </div>
  );
}

function PnLTable({ selectedBroker }) {
  const brokersToProcess = Array.isArray(selectedBroker) ? selectedBroker : [];
  const monthlyPnL = {};

  brokersToProcess.forEach(({ data, isAggregated }) => {
    if (data && typeof data === "object") {
      // Handle aggregated data differently
      if (isAggregated) {
        Object.entries(data).forEach(([date, value]) => {
          if (date && typeof date === "string" && date.includes("-")) {
            const [day, month, year] = date.split("-");
            if (day && month && year) {
              const monthKey = `${year}-${month.padStart(2, "0")}`;
              if (!monthlyPnL[monthKey]) {
                monthlyPnL[monthKey] = {};
              }
              // Access total_pl from the value object for aggregated data
              monthlyPnL[monthKey][day] = value.total_pl || 0;
            }
          }
        });
      } else {
        // Handle individual broker data
        Object.entries(data).forEach(([date, summary]) => {
          if (date && typeof date === "string" && date.includes("-")) {
            const [day, month, year] = date.split("-");
            if (day && month && year) {
              const monthKey = `${year}-${month.padStart(2, "0")}`;
              if (!monthlyPnL[monthKey]) {
                monthlyPnL[monthKey] = {};
              }
              monthlyPnL[monthKey][day] = summary?.total_pl || 0;
            }
          }
        });
      }
    }
  });

  const sortedMonths = Object.keys(monthlyPnL).sort((a, b) => (a > b ? -1 : 1));

  if (sortedMonths.length === 0) {
    return <p className="text-red-500 mt-4">No P&L data available for the selected broker.</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">
        {selectedBroker[0]?.isAggregated ? "Combined P&L (All Brokers)" : "Monthly P&L"}
      </h3>
      <div className="space-y-6">
        {sortedMonths.map((month) => {
          const daysInMonth = Array.from({ length: 31 }, (_, i) =>
            (i + 1).toString().padStart(2, "0")
          );
          return (
            <div key={month} className="p-4 border rounded-lg bg-gray-100">
              <h4 className="text-xl font-bold mb-2">{month}</h4>
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                  const totalPl = monthlyPnL[month][day];
                  return (
                    <div
                      key={day}
                      className="p-1 border text-center rounded-lg"
                    >
                      <p className="font-bold">{day}</p>
                      <p
                        className={`${
                          totalPl !== undefined
                            ? totalPl > 0
                              ? "text-green-500"
                              : "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {totalPl !== undefined
                          ? totalPl > 0
                            ? `+₹${totalPl}`
                            : `-₹${Math.abs(totalPl)}`
                          : "-"}
                      </p>
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