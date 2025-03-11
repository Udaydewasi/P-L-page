import { endpoints } from "../utils/apis";
const {EDIT_BROKER_API, DELETE_BROKER_API} = endpoints;

export const handleEditBrokerSubmit = async (gmail, broker, updatedFields, refreshCallback) => {
    try {
      const response = await fetch(EDIT_BROKER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail, broker, ...updatedFields }),
      });

      if (!response.ok) throw new Error("Failed to update broker details");
      const data = response.json();
      
      alert("Details Updated Successfully.");
      
      // Call refresh callback if provided
      if (typeof refreshCallback === 'function') {
        refreshCallback();
      }
      
      return data;
    } catch (error) {
      console.error("Error updating broker details:", error);
      throw error;
    }
}

export const deleteBroker = async (gmail, broker, refreshCallback) => {
  try{
    const response = await fetch(DELETE_BROKER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail, broker})
    });

    if(!response.ok) throw new Error ("Failed to delete broker");
    const data = response.json();
    alert("Broker Deleted successfully.");

    // Call refresh callback if provided
    if (typeof refreshCallback === 'function') {
      refreshCallback();
    }
    
    return data;
  }catch(e){
    console.error("Error deleting broker");
    throw e;
  }
}