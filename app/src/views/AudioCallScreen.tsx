import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  subscribeToCallSession,
  updateCallStatus,
} from "../services/callSessionService";
import useAgora from "../hooks/useAgora";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import DefaultCallControls from "../components/DefaultCallControls";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";
import { InteractionStackParamList } from "../../App";

interface AudioCallScreenProps {
  route: RouteProp<InteractionStackParamList, "AudioCall">;
}

const AudioCallScreen: React.FC<AudioCallScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { callData } = route.params;
  const { callPartner, callSessionId } = callData;
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const { isJoined, leaveChannel, toggleMute, setSpeakerphoneOn } = useAgora();

  useEffect(() => {
    const unsubscribe = subscribeToCallSession(
      callSessionId,
      (data) => {
        if (["rejected", "ended"].includes(data.status)) {
          setIsCallActive(false);
          Alert.alert(
            "Information",
            `The other party has ${data.status} the call.`
          );
          setTimeout(() => navigation.goBack(), 2000);
        }
      },
      console.error
    );
    return () => unsubscribe();
  }, [callSessionId]);

  useEffect(() => {
    isJoined && setIsCallActive(true);
  }, [isJoined]);

  useEffect(() => {
    if (!isCallActive) {
      leaveChannel();
    }
  }, [isCallActive, leaveChannel]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isCallActive) {
      timerId = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerId);
  }, [isCallActive]);

  const handleEndCall = async () => {
    await updateCallStatus(callSessionId, "ended");
    leaveChannel();
    navigation.goBack();
  };

  const handleMuteToggle = () => {
    toggleMute(!muted);
    setMuted((muted) => !muted);
  };

  const handleSpeakerToggle = () => {
    setSpeakerphoneOn(!speakerOn);
    setSpeakerOn((speakerOn) => !speakerOn);
  };

  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        {!isCallActive && <InactiveCallOverlay />}
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

export default AudioCallScreen;

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
    zIndex: 30,
  },
});
