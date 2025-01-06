import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Colors } from "../styles/commonStyles";
import { InteractionStackParamList } from "../../App";
import DiamondBackground from "../components/ui/DiamondBackground";
import DefaultCallControls from "../components/DefaultCallControls";
import { formatCallDuration } from "../utils/utils";

type AudioCallRouteProp = RouteProp<InteractionStackParamList, "AudioCall">;

interface AudioCallScreenProps {
  route: AudioCallRouteProp;
}

const AudioCallScreen: React.FC<AudioCallScreenProps> = ({ route }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  const navigation = useNavigation();
  const { callData } = route.params;
  const callPartner = callData.callPartner;

  const handleMuteToggle = () => {
    setMuted((prev) => !prev);
  };

  const handleSpeakerToggle = () => {
    setSpeakerOn((prev) => !prev);
  };

  const handleEndCall = () => {
    console.log("Call ended with", callPartner);
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
        <View style={styles.callPartnerContainer}>
          <Image source={{ uri: callPartner.avatar }} style={styles.avatar} />
          <Text style={styles.callPartnerName}>{callPartner.name}</Text>
          <Text style={styles.callDuration}>
            {formatCallDuration(callDuration)}
          </Text>
        </View>

        <View style={styles.defaultControlsContainer}>
          <DefaultCallControls
            muted={muted}
            speakerOn={speakerOn}
            onMuteToggle={handleMuteToggle}
            onSpeakerToggle={handleSpeakerToggle}
            onEndCall={handleEndCall}
          />
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
  callPartnerContainer: {
    alignItems: "center",
    marginBottom: 150,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  callPartnerName: {
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
  defaultControlsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    zIndex: 1,
  },
});

export default AudioCallScreen;
