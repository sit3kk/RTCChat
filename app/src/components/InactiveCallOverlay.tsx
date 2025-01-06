import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";

const InactiveCallOverlay: React.FC = () => {
  return (
    <View style={styles.InactiveCallOverlayContainer}>
      <Text style={styles.infoText}>Call is currently inactive.</Text>
      <Ionicons name="pause-outline" size={80} color={Colors.textLight} />
    </View>
  );
};

const styles = StyleSheet.create({
  InactiveCallOverlayContainer: {
    position: "absolute",
    backgroundColor: Colors.ternaryTransparent,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  infoText: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.textLight,
  },
});

export default InactiveCallOverlay;
