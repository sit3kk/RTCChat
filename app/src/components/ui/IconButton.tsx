import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/commonStyles";

interface IconButtonProps {
  name: string;
  size?: number;
  color?: string;
  onPress: () => void;
  style?: ViewStyle;
}

const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 32,
  color = Colors.textLight,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Ionicons name={name as any} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default IconButton;
