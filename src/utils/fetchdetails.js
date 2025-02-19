import { endpoints } from "./apis";
const { USER_DETAIL_API, CREDENTIAL_API, BROKER_DETAIL_API, EDIT_BROKER_API } = endpoints;

// Fetch user by email
export async function fetchUserByEmail(formData) {
  try {
    const { email, password, role } = formData;

    const response = await fetch(CREDENTIAL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: password, role: role }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user details, status: ${response.status}`);
    }

    const user = await response.json();
    if(role === 'user') return user.user ?? null;

    return user ?? null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}


// Fetch all users (for Admin)
export async function fetchAllUsers() {
  try {
    const response = await fetch(USER_DETAIL_API);

    if (!response.ok) {
      throw new Error("Failed to fetch all users");
    }
    const users = await response.json();
    
    return users ?? [];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function getBrokerDetails(gmail, broker) { 
  try {
    const url = `${BROKER_DETAIL_API}?gmail=${gmail}&broker=${broker}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch broker details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching broker details:", error);
    return null; 
  }
}

export async function updateBrokerDetails(gmail, broker, updatedFields) {
  try {
    const response = await fetch(EDIT_BROKER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gmail, broker, ...updatedFields }),
    });
    if (!response.ok) throw new Error("Failed to update broker details");
    return await response.json();
  } catch (error) {
    console.error("Error updating broker details:", error);
    throw error;
  }
}