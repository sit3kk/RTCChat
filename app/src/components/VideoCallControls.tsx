import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";

interface VideoCallControlsProps {
  cameraOn?: boolean;
  onCameraToggle?: () => void;
  onSwapCamera?: () => void;
}

const VideoCallControls: React.FC<VideoCallControlsProps> = ({
  cameraOn,
  onCameraToggle,
  onSwapCamera,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onCameraToggle && (
          <TouchableOpacity
            style={[
              styles.controlButton,
              cameraOn && styles.activeControlButton,
            ]}
            onPress={onCameraToggle}
          >
            <Ionicons
              name={cameraOn ? "videocam-outline" : "videocam-off-outline"}
              size={25}
              color={cameraOn ? Colors.textLight : Colors.textDimmed}
            />
          </TouchableOpacity>
        )}

        {onSwapCamera && (
          <TouchableOpacity
            style={[styles.controlButton, !cameraOn && styles.disabledButton]}
            onPress={onSwapCamera}
            disabled={!cameraOn}
          >
            <Ionicons
              name="camera-reverse"
              size={25}
              color={cameraOn ? Colors.textLight : Colors.textDimmed}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    gap: 11,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 10,
    backgroundColor: Colors.secondaryTransparent,
    width: 80,
    height: 65,
  },
  activeControlButton: {
    backgroundColor: Colors.secondaryTransparent,
  },
  disabledButton: {
    backgroundColor: Colors.disabledBackground,
  },
});

export default VideoCallControls;
