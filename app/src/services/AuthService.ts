import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/User";
import { fetchUserInfo } from "../api/AuthGateway";

const USER_STORAGE_KEY = "@user";

export const getStoredUser = async (): Promise<User | null> => {
  const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const removeUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
};

export const handleSignIn = async (accessToken: string): Promise<User> => {
  const user = await fetchUserInfo(accessToken);
  await saveUser(user);
  return user;
};