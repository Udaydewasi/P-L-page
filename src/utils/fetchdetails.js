import { endpoints } from "./apis";
const { USER_DETAIL_API, CREDENTIAL_API } = endpoints;

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

    // Ensure you wait for the response to resolve and parse JSON
    const user = await response.json();
    console.log("User fetched:", user);

    return user.user ?? null; // Return user data or null if undefined
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

    return users ?? []; // Ensures an empty array is returned if users is `undefined` or `null`
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function fetchUserDetails(email){
  try{
      const response = await fetch();
      if(!response.ok){
        throw new Error("Failed to fetch User's Details");
      }

      const user = await response.json();

      return user ?? [];
  }catch(e){
    console.error("Error fetching user details", e);
    return [];
  }
}
