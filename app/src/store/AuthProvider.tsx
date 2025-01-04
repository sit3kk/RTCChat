import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  token: string;
  isAuthenticated: boolean;
  fetchStoredToken: () => string | null;
  authenticate: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: "" as string,
  isAuthenticated: false,
  fetchStoredToken: () => {
    return null as string | null;
  },
  authenticate: (token: string) => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>();

  const AUTH_TOKEN_KEY = "@authToken";

  function fetchStoredToken() {
    AsyncStorage.getItem(AUTH_TOKEN_KEY)
      .then((token) => {
        if (token) {
          return token;
        }
      })
      .catch((_) => {
        return null;
      });
    return null;
  }

  function authenticate(token: string) {
    setAuthToken(token);
    AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }

  const value = {
    token: authToken || "",
    isAuthenticated: !!authToken,
    fetchStoredToken: fetchStoredToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
