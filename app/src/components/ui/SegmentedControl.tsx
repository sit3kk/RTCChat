import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../../styles/commonStyles";

interface SegmentedControlProps {
  selectedTab: string;
  onTabChange: (tab: "All" | "Unread") => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  selectedTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === "All" ? styles.tabActive : undefined,
        ]}
        onPress={() => onTabChange("All")}
      >
        <Text style={styles.tabText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === "Unread" ? styles.tabActive : undefined,
        ]}
        onPress={() => onTabChange("Unread")}
      >
        <Text style={styles.tabText}>Unread</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    backgroundColor: Colors.ternary,
    paddingVertical: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    color: Colors.textLight,
    fontWeight: "600",
  },
});

export default SegmentedControl;
