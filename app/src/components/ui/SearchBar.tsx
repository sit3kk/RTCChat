import React, { useEffect } from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/commonStyles";

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
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={Colors.textLight}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.textLight}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.ternary,
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
    color: Colors.textLight,
    textAlign: "center",
    paddingLeft: 35,
    paddingRight: 35,
  },
});

export default SearchBar;
