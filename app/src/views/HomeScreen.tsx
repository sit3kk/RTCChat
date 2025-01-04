import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../api/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <Text style={styles.text}>Welcome, {user.name}!</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      ) : (
        <Text style={styles.text}>No user data found.</Text>
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
    marginBottom: 10,
  },
});
