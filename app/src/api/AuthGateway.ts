import { User } from "../types/User";

export const fetchUserInfo = async (accessToken: string): Promise<User> => {
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};