import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";
import VideoCallControls from "../components/VideoCallControls";
import DefaultCallControls from "../components/DefaultCallControls";
import { Ionicons } from "@expo/vector-icons";
import { InteractionStackParamList } from "../../App";

import {
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  RtcConnection,
} from "react-native-agora";
import { PermissionsAndroid, Platform } from "react-native";

type VideoCallRouteProp = RouteProp<InteractionStackParamList, "VideoCall">;

interface VideoCallScreenProps {
  route: VideoCallRouteProp;
}

const appId = "f2f502f3c8ee422b9511b9d0c04e6821";
const token =
  "007eJxTYDi1V8Quy9dq9dRuRf83y2X3qUmmbk+JFd15d8vJC5VrjzQqMKQZpZkaGKUZJ1ukppoYGSVZmhoaJlmmGCQbmKSaWRgZJs1rTm8IZGR4M20xAyMUgvgsDCWpxSUMDABbnyA3";
const uid = 0;
const channelName = "test";

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { callData } = route.params;
  const { callPartner, callSessionId } = callData;

  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [remoteUid, setRemoteUid] = useState<number>(0);

  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const eventHandlerRef = useRef<IRtcEngineEventHandler>({});

  useEffect(() => {
    const callDocRef = doc(db, "callSessions", callSessionId);
    const unsub = onSnapshot(callDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      if (data.status === "rejected") {
        Alert.alert("Information", "The call was rejected.");
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
    const engine = createAgoraRtcEngine();
    agoraEngineRef.current = engine;

    eventHandlerRef.current = {
      onJoinChannelSuccess: (_connection, _elapsed) => {
        console.log("Join channel success");
      },
      onUserJoined: (_connection: RtcConnection, remoteUid: number) => {
        console.log("Remote user joined:", remoteUid);
        setRemoteUid(remoteUid);
      },
      onUserOffline: (_connection, remoteUid) => {
        console.log("Remote user offline:", remoteUid);
        setRemoteUid(0);
      },
    };
    engine.registerEventHandler(eventHandlerRef.current);

    engine.initialize({
      appId: appId,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });
    engine.enableVideo();

    engine.startPreview();
  }

  function joinChannel() {
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
      publishCameraTrack: true,
      publishMicrophoneTrack: true,
    });
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

  function handleCameraToggle() {
    const newCameraState = !cameraOn;
    setCameraOn(newCameraState);
    agoraEngineRef.current?.muteLocalVideoStream(!newCameraState);
  }

  function handleSwapCamera() {
    agoraEngineRef.current?.switchCamera();
  }

  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        {!isCallActive && <InactiveCallOverlay />}

        <View style={styles.videoControlsContainer}>
          <VideoCallControls
            cameraOn={cameraOn}
            onCameraToggle={handleCameraToggle}
            onSwapCamera={handleSwapCamera}
          />
        </View>

        <Text style={styles.callPartnerName}>{callPartner.name}</Text>
        <Text style={styles.callDuration}>
          {formatCallDuration(callDuration)}
        </Text>

        <View style={styles.calleeVideoView}>
          {cameraOn ? (
            <RtcSurfaceView
              style={{ width: 140, height: 180 }}
              canvas={{ uid: 0 }}
            />
          ) : (
            <>
              <Ionicons
                name="videocam-off-outline"
                size={40}
                color={Colors.textLight}
              />
              <Text style={styles.cameraStatus}>Camera Off</Text>
            </>
          )}
        </View>

        <View style={styles.videoCallPartnerContainer}>
          <View style={styles.callPartnerVideoView}>
            {remoteUid !== 0 ? (
              <RtcSurfaceView
                style={{ width: "100%", height: "100%" }}
                canvas={{ uid: remoteUid }}
              />
            ) : (
              <>
                <Image
                  source={{ uri: callPartner.avatar }}
                  style={styles.avatar}
                />
                <Text style={styles.cameraStatus}>
                  {callPartner.name} - Remote Video
                </Text>
              </>
            )}
          </View>
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

export default VideoCallScreen;

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
    position: "relative",
  },
  videoControlsContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  callPartnerName: {
    position: "absolute",
    top: 140,
    left: 45,
    right: 0,
    zIndex: 1,
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  calleeVideoView: {
    position: "absolute",
    top: 60,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryTransparent,
    borderRadius: 10,
    height: 200,
    width: 150,
    zIndex: 10,
  },
  videoCallPartnerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30,
    position: "relative",
  },
  callPartnerVideoView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: Colors.secondaryTransparent,
    borderRadius: 10,
    height: 500,
  },
  cameraStatus: {
    textAlign: "center",
    fontSize: 15,
    color: Colors.textLight,
    marginTop: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  callDuration: {
    position: "absolute",
    top: 315,
    right: -25,
    transform: [{ rotate: "90deg" }],
    zIndex: 2,
    fontSize: 20,
    fontFamily: "monospace",
    color: Colors.textDimmed,
    width: 120,
    textAlign: "left",
  },
  defaultControlsContainer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    zIndex: 1,
  },
});
