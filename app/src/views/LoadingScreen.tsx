import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";

const LoadingScreen = () => {
  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
