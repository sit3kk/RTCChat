import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert, ActivityIndicator } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { fetchUserData } from "../services/authGateway";
import { useAuth } from "../store/AuthProvider";
import { useUserData } from "../store/UserDataProvider";
import { REACT_APP_IOS_CLIENT_ID, REACT_APP_WEB_CLIENT_ID } from "@env";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../styles/commonStyles";
import Button from "../components/ui/Button";
import DiamondBackground from "../components/ui/DiamondBackground";

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
    } else if (response?.type === "cancel") {
      setIsAuthenticating(false);
    }
  }

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  return (
    <>
      <DiamondBackground />
      <SafeAreaView style={styles.contentContainer}>
        <View
          style={{
            ...styles.textContainer,
            paddingTop: 100,
            paddingRight: 20,
          }}
        >
          <Text style={styles.title}>More Than</Text>
          <Text style={styles.title}>Words,</Text>
          <Text style={styles.title}>
            It’s a <Text style={styles.highlight}>Connection.</Text>
          </Text>
        </View>
        <View style={styles.middleContainer}>
          {isAuthenticating ? (
            <>
              <Text style={styles.text}>Logging you in...</Text>
              <ActivityIndicator size="large" color={Colors.primary} />
            </>
          ) : (
            <Button
              title="Log in with Google"
              onPress={loginHandler}
              type="secondary"
              disabled={false}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={{ ...styles.footerText, letterSpacing: 9 }}>
            built on WebRTC
          </Text>
          <Text style={styles.footerText}>by Konrad Sitek, Paweł Małecki</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: 150,
  },
  middleContainer: {
    height: 400,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    color: Colors.textLight,
    marginBottom: 5,
    letterSpacing: 1.4,
  },
  highlight: {
    color: Colors.primary,
    fontWeight: "600",
  },
  text: {
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "left",
    marginTop: 5,
    letterSpacing: 1.4,
  },
});
