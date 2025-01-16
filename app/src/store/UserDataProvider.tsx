import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { UserData } from "../types/commonTypes";
import { generateInvitationCode } from "../utils/utils";

interface UserDataContextProps {
  userId: string;
  userName: string;
  userEmail: string;
  userPicture: string;
  invitationCode: string;
  setUserData: (data: UserData) => Promise<void>;
  clearUserData: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPicture, setUserPicture] = useState<string>("");
  const [invitationCode, setInvitationCode] = useState<string>("");

  const USER_DATA_KEY = "@userData";

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (storedUserData) {
        const parsedData: UserData = JSON.parse(storedUserData);
        setUserId(parsedData.id);
        setUserName(parsedData.name);
        setUserEmail(parsedData.email);
        setUserPicture(parsedData.picture);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const setUserData = async (data: UserData) => {
    try {
      await saveUserToFirestore(data);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
      setUserId(data.id);
      setUserName(data.name);
      setUserEmail(data.email);
      setUserPicture(data.picture);
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUserId("");
      setUserName("");
      setUserEmail("");
      setUserPicture("");
    } catch (error) {
      console.error("Failed to clear user data:", error);
    }
  };

  const saveUserToFirestore = async (user: UserData) => {
    try {
      const userDoc = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const existingUser = userSnapshot.data();
        console.log(
          "Existing user invitation code:",
          existingUser.invitationCode
        );
        setInvitationCode(existingUser.invitationCode);
      } else {
        const invitationCode = generateInvitationCode();
        await setDoc(userDoc, {
          name: user.name,
          email: user.email,
          profilePic: user.picture,
          invitationCode: invitationCode,
        });
        console.log(
          "User saved to Firestore with invitation code:",
          invitationCode
        );
        setInvitationCode(invitationCode);
      }
    } catch (error) {
      throw new Error("Error saving user to Firestore:" + error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const value: UserDataContextProps = {
    userId,
    userName,
    userEmail,
    userPicture,
    invitationCode,
    setUserData,
    clearUserData,
    loadUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
