import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";
import { InteractionStackParamList } from "../../App";
import DiamondBackground from "../components/ui/DiamondBackground";
import { StackNavigationProp } from "@react-navigation/stack";

type ActiveAudioCallRouteProp = RouteProp<
  InteractionStackParamList,
  "ActiveAudioCall"
>;

interface ActiveAudioCallScreenProps {
  route: ActiveAudioCallRouteProp;
}

const ActiveAudioCallScreen: React.FC<ActiveAudioCallScreenProps> = ({
  route,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  const { callData } = route.params;
  const caller = callData.caller;

  const navigation =
    useNavigation<StackNavigationProp<InteractionStackParamList>>();

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMuteToggle = () => {
    const newMuteState = !muted;
    setMuted(newMuteState);
  };

  const handleSpeakerToggle = () => {
    const newSpeakerState = !speakerOn;
    setSpeakerOn(newSpeakerState);
  };

  const handleEndCall = () => {
    console.log("Call ended with", caller);
    navigation.goBack();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <Image source={{ uri: caller.avatar }} style={styles.avatar} />
        <Text style={styles.callerName}>{caller.name}</Text>
        <Text style={styles.callDuration}>
          {formatCallDuration(callDuration)}
        </Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, muted && styles.activeControlButton]}
            onPress={handleMuteToggle}
          >
            <Ionicons
              name={muted ? "mic-off" : "mic"}
              size={30}
              color={muted ? Colors.danger : Colors.textLight}
            />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={30} color="#fff" />
            <Text style={styles.controlLabel}>End</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              speakerOn && styles.activeControlButton,
            ]}
            onPress={handleSpeakerToggle}
          >
            <Ionicons
              name={speakerOn ? "volume-high" : "volume-low"}
              size={30}
              color={speakerOn ? Colors.primary : Colors.textLight}
            />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  callerName: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textLight,
    marginBottom: 10,
  },
  callDuration: {
    fontSize: 20,
    color: Colors.textDimmed,
    marginBottom: 40,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingTop: 250,
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

export default ActiveAudioCallScreen;
