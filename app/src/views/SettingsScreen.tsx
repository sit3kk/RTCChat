import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useAuth } from "../store/AuthProvider";
import { useUserData } from "../store/UserDataProvider";
import DiamondBackground from "../components/ui/DiamondBackground";
import { Colors } from "../styles/commonStyles";
import Button from "../components/ui/Button";

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
        <Image
          source={{ uri: userCtx.userPicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.userName}>{userCtx.userName}</Text>
        <Text style={styles.text}>{userCtx.userEmail}</Text>
        <Text style={styles.text}>
          Your invitation code:{" "}
          <Text style={styles.textAccent}>{userCtx.invitationCode}</Text>
        </Text>

        <View style={{ marginTop: 100, gap: 10 }}>
          <Button
            title="Edit profile"
            type={"secondary"}
            disabled={true}
            onPress={() => {}}
          />
          <Button
            title="Change password"
            type={"secondary"}
            width={25}
            disabled={true}
            onPress={() => {}}
          />
          <Button
            title="Delete account"
            type={"secondary"}
            disabled={true}
            onPress={() => {}}
          />

          <Button title="Log out" type={"secondary"} onPress={handleLogOut} />
        </View>
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
  textAccent: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textAccent,
  },
});

export default SettingsScreen;
