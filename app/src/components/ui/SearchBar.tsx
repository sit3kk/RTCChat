import React from "react";
import { TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/commonStyles";
import FlatTextInput from "./FlatTextInput";

interface SearchBarProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  ...textInputProps
}) => {
  return (
    <FlatTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      icon={<Ionicons name="search" size={20} color={Colors.textLight} />}
      textAlign="center"
      isDarkMode={true}
      {...textInputProps}
    />
  );
};

export default SearchBar;
