// editBroker.js
import { endpoints } from "../utils/apis";
const {EDIT_BROKER_API} = endpoints;

export const handleEditBrokerSubmit = async (gmail, broker, updatedFields) => {
    try {
      const response = await fetch(EDIT_BROKER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail, broker, ...updatedFields }),
      });

      if (!response.ok) throw new Error("Failed to update broker details");
      const data = response.json();
      
      alert("Details Updated Successfully.");
      
      return data;
    } catch (error) {
      console.error("Error updating broker details:", error);
      throw error;
    }
  }