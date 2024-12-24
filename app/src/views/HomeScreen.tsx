import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../api/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userDoc = await getDoc(doc(db, "users", parsedUser.id));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem("@user");
    setUser(null);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Welcome, {user.name}!</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      ) : (
        <Text style={styles.text}>Loading...</Text>
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
    fontSize: 18,
    fontWeight: "bold",
  },
});
