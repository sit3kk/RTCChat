import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@env";
import { db } from "../api/FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      } else {
        console.error("Access token is undefined");
      }
    }
  }, [response]);

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const user = await userInfoResponse.json();

      await saveUserToFirestore(user);

      setUserInfo(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const generateInvitationCode = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  };

  const saveUserToFirestore = async (user: any) => {
    try {
      const userDoc = doc(db, "users", user.id);

      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const existingUser = userSnapshot.data();
        console.log(
          "Existing user invitation code:",
          existingUser.invitationCode
        );
        setUserInfo({ ...user, invitationCode: existingUser.invitationCode });
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
        setUserInfo({ ...user, invitationCode: invitationCode });
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
      {userInfo && <Text style={styles.text}>Welcome, {userInfo.name}</Text>}
      {userInfo && userInfo.invitationCode && (
        <Text style={styles.text}>
          Your invitation code: {userInfo.invitationCode}
        </Text>
      )}
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
