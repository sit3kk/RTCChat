import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../styles/commonStyles";

const LoadingScreen = () => {
  return (
    // Todo: Create better loading screen
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
