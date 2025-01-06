import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Colors } from "../../styles/commonStyles";

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  type?: "primary" | "secondary";
  width?: number | string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  type = "primary",
  width = "auto",
}) => {
  const buttonColorStyle =
    type === "primary" ? styles.primaryButton : styles.secondaryButton;
  const dynamicPadding = typeof width === "number" ? width / 2 : 30;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonColorStyle,
        { paddingHorizontal: dynamicPadding },
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  primaryButton: {
    backgroundColor: Colors.primaryTransparent,
    borderColor: Colors.primaryTransparent,
  },
  secondaryButton: {
    backgroundColor: Colors.secondaryTransparent,
    borderColor: Colors.secondaryTransparent,
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
