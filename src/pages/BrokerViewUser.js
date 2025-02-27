import React from "react";

export function BrokerView({ user, brokerData, setSelectedBroker }) {
  const brokers = ["upstox"];

  const connectedBrokers = brokerData
    ? brokers.filter((broker) => brokerData[broker] && brokerData[broker].length > 0)
    : [];

  return (
    <div>
      <h3 className="text-lg font-semibold">Connected Brokers:</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {connectedBrokers.length > 0 ? (
          connectedBrokers.map((broker) => (
            <div
              key={broker}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <span className="font-bold">
                {broker.charAt(0).toUpperCase() + broker.slice(1)}
              </span>
            </div>
          ))
        ) : (
          <p>No brokers connected</p> // Added fallback in case no brokers are found
        )}
      </div>
    </div>
  );
}
