import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { fetchUserData } from "../api/AuthGateway";
import { useAuth } from "../store/AuthProvider";
import { useUserData } from "../store/UserDataProvider";
import LoadingScreen from "./LoadingScreen";
import { REACT_APP_IOS_CLIENT_ID, REACT_APP_WEB_CLIENT_ID } from "@env";

export default function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: REACT_APP_IOS_CLIENT_ID,
    webClientId: REACT_APP_WEB_CLIENT_ID,
  });

  const authCtx = useAuth();
  const userCtx = useUserData();

  async function loginHandler() {
    setIsAuthenticating(true);
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }

  async function handleSignInWithGoogle() {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserData(authentication.accessToken).then((user) => {
          console.log("fetched UserData ", user);
          authCtx.authenticate(user.id);
          userCtx.setUserData(user);
        });
      } else {
        console.error("Access token is undefined");
      }
    }
  }

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  return isAuthenticating ? (
    <View style={styles.container}>
      <Text style={styles.text}>Logging you in...</Text>
      <LoadingScreen />
    </View>
  ) : (
    <View style={styles.container}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={loginHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});
