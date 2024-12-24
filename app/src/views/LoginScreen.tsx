import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getStoredUser,
  handleSignIn,
  removeUser,
} from "../services/AuthService";
import UserInfo from "../components/UserInfo";
import { User } from "../types/User";
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@sit3kk/app",
  });

  useEffect(() => {
    const loadStoredUser = async () => {
      const user = await getStoredUser();
      if (user) {
        setUserInfo(user);
      }
    };
    loadStoredUser();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleSignIn(authentication.accessToken)
        .then(setUserInfo)
        .catch(console.error);
    }
  }, [response]);

  const handleSignOut = async () => {
    await removeUser();
    setUserInfo(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {userInfo ? (
        <UserInfo userInfo={userInfo} onSignOut={handleSignOut} />
      ) : (
        <Button
          title="Zaloguj się przez Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
};

export default LoginScreen;
