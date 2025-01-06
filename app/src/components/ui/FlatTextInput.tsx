import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from "react-native";
import { Colors } from "../../styles/commonStyles";

interface FlatTextInputProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: React.ReactNode;
  textAlign?: "left" | "center" | "right";
  isDarkMode?: boolean;
  width?: number | string;
}

const FlatTextInput: React.FC<FlatTextInputProps> = ({
  placeholder = "Enter text...",
  value,
  onChangeText,
  icon,
  textAlign = "left",
  isDarkMode = false,
  width = "100%",
  ...textInputProps
}) => {
  // Temporary fix for the dark mode text color
  const textColor = isDarkMode ? Colors.textLight : Colors.ternary;
  const containerStyle: StyleProp<ViewStyle> = {
    ...styles.container,
    width: width as DimensionValue | undefined,
    backgroundColor: isDarkMode ? Colors.ternary : Colors.textLight,
  };
  const inputStyle = {
    ...styles.input,
    color: textColor,
    textAlign,
    paddingLeft: icon ? 35 : 0,
    paddingRight: icon ? 35 : 0,
  };

  return (
    <View style={containerStyle}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={textColor}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginVertical: 10,
  },
  icon: {
    position: "absolute",
    left: 13,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default FlatTextInput;
