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
  height?: number | string;
}

const DEFAULT_WIDTH = 30;
const DEFAULT_HIGHT = 8;

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled,
  type = "primary",
  width = "auto",
  height = "auto",
}) => {
  const buttonColorStyle =
    type === "primary" ? styles.primaryButton : styles.secondaryButton;
  const dynamicPaddingHorizontal =
    typeof width === "number" ? width / 2 : DEFAULT_WIDTH;
  const dynamicPaddingVertical =
    typeof height === "number" ? height / 2 : DEFAULT_HIGHT;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonColorStyle,
        {
          paddingHorizontal: dynamicPaddingHorizontal,
          paddingVertical: dynamicPaddingVertical,
        },
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
    color: Colors.textDimmed,
  },
});

export default Button;
