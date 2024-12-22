import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  const handleSignInWithGoogle = async () => {
    const storedUser = await AsyncStorage.getItem("@user");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("@user");
    setUserInfo(null);
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Witaj, {userInfo.name}!</Text>
          <Button title="Wyloguj się" onPress={handleSignOut} />
        </View>
      ) : (
        <Button
          title="Zaloguj się przez Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
