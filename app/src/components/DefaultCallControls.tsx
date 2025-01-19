import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";

interface DefaultCallControlsProps {
  muted: boolean;
  speakerOn: boolean;
  onMuteToggle: () => void;
  onSpeakerToggle: () => void;
  onEndCall: () => void;
}

const DefaultCallControls: React.FC<DefaultCallControlsProps> = ({
  muted,
  speakerOn,
  onMuteToggle,
  onSpeakerToggle,
  onEndCall,
}) => {
  return (
    <View style={styles.row}>
      {/* Mute Button */}
      <TouchableOpacity
        style={[styles.controlButton, muted && styles.disabledButton]}
        onPress={onMuteToggle}
      >
        <Ionicons
          name={muted ? "mic-off" : "mic"}
          size={30}
          color={muted ? Colors.textDimmed : Colors.textLight}
        />
      </TouchableOpacity>

      {/* End Call Button */}
      <TouchableOpacity
        style={[styles.controlButton, styles.endCallButton]}
        onPress={onEndCall}
      >
        <Ionicons name="call" size={30} color="#fff" />
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
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    marginBottom: 40,
    zIndex: 25, // to make sure it's above the InactiveCallOverlay
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 50,
    backgroundColor: Colors.secondaryTransparent,
    width: 80,
    height: 80,
  },
  activeControlButton: {
    backgroundColor: Colors.primaryTransparent,
  },
  disabledButton: {
    backgroundColor: Colors.disabledBackground,
  },
  endCallButton: {
    backgroundColor: Colors.danger,
  },
});

export default DefaultCallControls;
