import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { UserData } from "../types/UserData";

interface UserInfoProps {
  userInfo: UserData;
  onSignOut: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ userInfo, onSignOut }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
      <Text>Witaj, {userInfo.name}!</Text>
      <Button title="Wyloguj się" onPress={onSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default UserInfo;
