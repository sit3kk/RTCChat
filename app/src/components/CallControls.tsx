import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";

interface CallControlsProps {
  muted: boolean;
  speakerOn: boolean;
  onMuteToggle: () => void;
  onSpeakerToggle: () => void;
  onEndCall: () => void;
  cameraOn?: boolean;
  onCameraToggle?: () => void; // Optional for video calls
  onSwapCamera?: () => void; // Optional for video calls
}

const CallControls: React.FC<CallControlsProps> = ({
  muted,
  speakerOn,
  onMuteToggle,
  onSpeakerToggle,
  onEndCall,
  cameraOn,
  onCameraToggle,
  onSwapCamera,
}) => {
  return (
    <View style={styles.controlsContainer}>
      {/* Mute Button */}
      <TouchableOpacity
        style={[styles.controlButton, muted && styles.activeControlButton]}
        onPress={onMuteToggle}
      >
        <Ionicons
          name={muted ? "mic-off" : "mic"}
          size={30}
          color={muted ? Colors.danger : Colors.textLight}
        />
        <Text style={styles.controlLabel}>Mute</Text>
      </TouchableOpacity>

      {/* Camera Toggle Button (Optional) */}
      {onCameraToggle && (
        <TouchableOpacity
          style={[styles.controlButton, cameraOn && styles.activeControlButton]}
          onPress={onCameraToggle}
        >
          <Ionicons
            name={cameraOn ? "camera" : "camera-outline"}
            size={30}
            color={cameraOn ? Colors.primary : Colors.textLight}
          />
          <Text style={styles.controlLabel}>Camera</Text>
        </TouchableOpacity>
      )}

      {/* Swap Camera Button (Optional) */}
      {onSwapCamera && (
        <TouchableOpacity style={styles.controlButton} onPress={onSwapCamera}>
          <Ionicons name="camera-reverse" size={30} color={Colors.textLight} />
          <Text style={styles.controlLabel}>Swap</Text>
        </TouchableOpacity>
      )}

      {/* End Call Button */}
      <TouchableOpacity
        style={[styles.controlButton, styles.endCallButton]}
        onPress={onEndCall}
      >
        <Ionicons name="call" size={30} color="#fff" />
        <Text style={styles.controlLabel}>End</Text>
      </TouchableOpacity>

      {/* Speaker Button */}
      <TouchableOpacity
        style={[styles.controlButton, speakerOn && styles.activeControlButton]}
        onPress={onSpeakerToggle}
      >
        <Ionicons
          name={speakerOn ? "volume-high" : "volume-low"}
          size={30}
          color={speakerOn ? Colors.primary : Colors.textLight}
        />
        <Text style={styles.controlLabel}>Speaker</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 50,
    backgroundColor: Colors.secondaryTransparent,
    width: 85,
    height: 85,
  },
  activeControlButton: {
    backgroundColor: Colors.primaryTransparent,
  },
  endCallButton: {
    backgroundColor: Colors.danger,
  },
  controlLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textLight,
  },
});

export default CallControls;
