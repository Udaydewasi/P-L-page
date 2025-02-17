import { endpoints } from "./apis";
const { USER_DETAIL_API, CREDENTIAL_API } = endpoints;

// Fetch user by email
export async function fetchUserByEmail(formData) {
  try {
    const { email, password } = formData;
    const response = await fetch(CREDENTIAL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: password }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const user = await response.json();

    return user ?? null; // Ensures `null` is returned only if user is `undefined` or `null`
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
