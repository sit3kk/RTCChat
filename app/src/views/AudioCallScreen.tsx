import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import DefaultCallControls from "../components/DefaultCallControls";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";
import { InteractionStackParamList } from "../../App";

// ----- Agora importy -----
import {
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";

import { PermissionsAndroid, Platform } from "react-native";

type AudioCallRouteProp = RouteProp<InteractionStackParamList, "AudioCall">;

interface AudioCallScreenProps {
  route: AudioCallRouteProp;
}

const appId = "f2f502f3c8ee422b9511b9d0c04e6821";
const token =
  "007eJxTYDi1V8Quy9dq9dRuRf83y2X3qUmmbk+JFd15d8vJC5VrjzQqMKQZpZkaGKUZJ1ukppoYGSVZmhoaJlmmGCQbmKSaWRgZJs1rTm8IZGR4M20xAyMUgvgsDCWpxSUMDABbnyA3";
const uid = 0;
const channelName = "test";

const AudioCallScreen: React.FC<AudioCallScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { callData } = route.params;
  const { callPartner, callSessionId } = callData;

  // Agora
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const eventHandlerRef = useRef<IRtcEngineEventHandler>({});
  const [remoteUid, setRemoteUid] = useState<number>(0);

  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

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

  useEffect(() => {
    initAgora().then(() => {
      joinChannel();
    });

    return () => {
      leaveChannel();
      agoraEngineRef.current?.unregisterEventHandler(eventHandlerRef.current!);
      agoraEngineRef.current?.release();
      agoraEngineRef.current = null;
    };
  }, []);

  async function initAgora() {
    if (Platform.OS === "android") {
      await getPermission();
    }
    const agoraEngine = createAgoraRtcEngine();
    agoraEngineRef.current = agoraEngine;

    // Zarejestruj eventy
    eventHandlerRef.current = {
      onJoinChannelSuccess: (_connection, _elapsed) => {
        console.log("Join channel success");
      },
      onUserJoined: (_connection, remoteUid) => {
        console.log("Remote user joined:", remoteUid);
        setRemoteUid(remoteUid);
      },
      onUserOffline: (_connection, remoteUid) => {
        console.log("Remote user offline:", remoteUid);
        setRemoteUid(0);
      },
    };
    agoraEngine.registerEventHandler(eventHandlerRef.current);

    agoraEngine.initialize({
      appId: appId,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });
    agoraEngine.enableAudio();
  }

  async function joinChannel() {
    try {
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: true,
      });
    } catch (err) {
      console.warn("Join channel error", err);
    }
  }

  function leaveChannel() {
    agoraEngineRef.current?.leaveChannel();
  }

  async function handleEndCall() {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "ended",
    });
    navigation.goBack();
  }

  function handleMuteToggle() {
    const newMuteState = !muted;
    setMuted(newMuteState);
    agoraEngineRef.current?.muteLocalAudioStream(newMuteState);
  }

  function handleSpeakerToggle() {
    const newSpeakerState = !speakerOn;
    setSpeakerOn(newSpeakerState);
    agoraEngineRef.current?.setEnableSpeakerphone(newSpeakerState);
  }

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

async function getPermission() {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
}

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
