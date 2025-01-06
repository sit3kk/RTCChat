import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../../styles/commonStyles";

interface FlatButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

const FlatButton: React.FC<FlatButtonProps> = ({ title, onPress, color }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={[styles.buttonText, color && { color: color }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: 15,
  },
});

export default FlatButton;
