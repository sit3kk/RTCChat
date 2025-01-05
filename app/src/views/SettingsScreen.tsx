import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { useAuth } from "../store/AuthProvider";
import { useUserData } from "../store/UserDataProvider";

const SettingsScreen: React.FC = () => {
  const authCtx = useAuth();
  const userCtx = useUserData();

  const handleLogOut = async () => {
    authCtx.logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Image
        source={{ uri: userCtx.userPicture }}
        style={styles.profilePicture}
      />
      <Text style={styles.userName}>{userCtx.userName}</Text>
      <Text style={styles.userEmail}>{userCtx.userEmail}</Text>
      <Text style={styles.userEmail}>
        Your invitation code: {userCtx.invitationCode}
      </Text>

      <Button title="Log out" onPress={handleLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
});

export default SettingsScreen;
