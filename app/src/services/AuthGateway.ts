import { UserData } from "../types/commonTypes";

export const fetchUserData = async (accessToken: string): Promise<UserData> => {
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch user data with status ${response.status}`
      );
    }
    const user = await response.json();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};
