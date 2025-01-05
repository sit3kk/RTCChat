import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { Colors } from "../../styles/commonStyles";

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  isLoading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text
          style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: Colors.secondaryTransparent,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.secondaryTransparent,
    marginTop: 20,
  },
  buttonDisabled: {
    color: Colors.textAccent,
    backgroundColor: Colors.disabledBackground,
    borderColor: Colors.disabledBackground,
  },
  buttonText: {
    color: Colors.textAccent,
    fontSize: 15,
    fontWeight: "500",
  },
  buttonTextDisabled: {
    color: Colors.textDimed,
  },
});

export default Button;
