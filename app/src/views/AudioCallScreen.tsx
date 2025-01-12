// src/views/AudioCallScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../api/FirebaseConfig";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import DefaultCallControls from "../components/DefaultCallControls";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";
import { InteractionStackParamList } from "../../App";

type AudioCallRouteProp = RouteProp<InteractionStackParamList, "AudioCall">;

interface AudioCallScreenProps {
  route: AudioCallRouteProp;
}

const AudioCallScreen: React.FC<AudioCallScreenProps> = ({ route }) => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  const navigation = useNavigation();
  const { callData } = route.params;
  const { callPartner, callSessionId } = callData;

  useEffect(() => {
    const callDocRef = doc(db, "callSessions", callSessionId);
    const unsub = onSnapshot(callDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      if (data.status === "rejected") {
        Alert.alert("Information", "The other party rejected the call.");
        navigation.goBack();
      }
      if (data.status === "ended") {
        Alert.alert("Information", "The call has ended.");
        navigation.goBack();
      }
    });

    return () => unsub();
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Here you can call Agora logic: joinChannel, listenForEvents, etc.
  // useEffect(() => {
  //   // joinAgoraChannel(...)
  //   // ...
  // }, []);

  const handleEndCall = async () => {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "ended",
    });
    navigation.goBack();
  };

  const handleMuteToggle = () => {
    setMuted((prev) => !prev);
  };

  const handleSpeakerToggle = () => {
    setSpeakerOn((prev) => !prev);
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
