import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { useAuth } from "../store/AuthProvider";
import { useUserData } from "../store/UserDataProvider";
import DiamondBackground from "../components/ui/DiamondBackground";
import { Colors } from "../styles/commonStyles";

const SettingsScreen: React.FC = () => {
  const authCtx = useAuth();
  const userCtx = useUserData();

  const handleLogOut = async () => {
    authCtx.logout();
  };

  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <Image
          source={{ uri: userCtx.userPicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.userName}>{userCtx.userName}</Text>
        <Text style={styles.text}>{userCtx.userEmail}</Text>
        <Text style={styles.text}>
          Your invitation code: {userCtx.invitationCode}
        </Text>

        <Button title="Log out" onPress={handleLogOut} />
      </View>
    </>
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
    color: Colors.textLight,
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
    color: Colors.textLight,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.textLight,
  },
});

export default SettingsScreen;
