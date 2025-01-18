import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
} from "react-native-agora";

// Agora SDK configuration
const appId = "f2f502f3c8ee422b9511b9d0c04e6821";
const token =
  "007eJxTYGg/oG/MsePE/xNNsd6s+9xkui9WH52voePvI2mRHzZj8XcFhjSjNFMDozTjZIvUVBMjoyRLU0PDJMsUg2QDk1QzCyPDzv7q9IZARobwrVqsjAwQCOKzMJSkFpcwMAAA+4QeJA==";
const channelName = "test";
const uid = 0;

const App = () => {
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isVideoCall, setIsVideoCall] = useState(true); // Toggle between video and voice
  const [message, setMessage] = useState("");

  useEffect(() => {
    setupAgoraEngine();
    return () => {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.unregisterEventHandler(eventHandler);
        agoraEngineRef.current.release();
      }
    };
  }, []);

  const setupAgoraEngine = async () => {
    try {
      if (Platform.OS === "android") {
        await requestPermissions();
      }
      const agoraEngine = createAgoraRtcEngine();
      agoraEngineRef.current = agoraEngine;

      agoraEngine.initialize({
        appId: appId,
      });

      agoraEngine.registerEventHandler(eventHandler);

      if (isVideoCall) {
        agoraEngine.enableVideo();
      } else {
        agoraEngine.disableVideo();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const joinChannel = async () => {
    if (isJoined) return;

    try {
      const agoraEngine = agoraEngineRef.current;
      if (!agoraEngine) return;

      if (isHost) {
        agoraEngine.startPreview();
        agoraEngine.joinChannel(token, channelName, uid, {
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          publishCameraTrack: isVideoCall,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
      } else {
        agoraEngine.joinChannel(token, channelName, uid, {
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          clientRoleType: ClientRoleType.ClientRoleAudience,
          publishMicrophoneTrack: false,
          publishCameraTrack: false,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const leaveChannel = () => {
    try {
      const agoraEngine = agoraEngineRef.current;
      if (!agoraEngine) return;

      agoraEngine.leaveChannel();
      setIsJoined(false);
      setRemoteUid(0);
      showMessage("Left the channel");
    } catch (e) {
      console.log(e);
    }
  };

  const eventHandler: IRtcEngineEventHandler = {
    onJoinChannelSuccess: () => {
      showMessage("Successfully joined the channel");
      setIsJoined(true);
    },
    onUserJoined: (_connection: RtcConnection, uid: number) => {
      showMessage(`Remote user joined: ${uid}`);
      setRemoteUid(uid);
    },
    onUserOffline: (_connection: RtcConnection, uid: number) => {
      showMessage(`Remote user left: ${uid}`);
      setRemoteUid(0);
    },
  };

  const toggleCallType = () => {
    if (isJoined) {
      leaveChannel();
    }
    setIsVideoCall(!isVideoCall);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
  };

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>Agora SDK: Video & Voice Call</Text>
      <View style={styles.btnContainer}>
        <Text onPress={joinChannel} style={styles.button}>
          Join Channel
        </Text>
        <Text onPress={leaveChannel} style={styles.button}>
          Leave Channel
        </Text>
      </View>
      <View style={styles.toggleContainer}>
        <Text>Voice Call</Text>
        <Switch onValueChange={toggleCallType} value={isVideoCall} />
        <Text>Video Call</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {isJoined && isHost && isVideoCall && (
          <>
            <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
            <Text>Local user uid: {uid}</Text>
          </>
        )}
        {isJoined && remoteUid !== 0 ? (
          <>
            <RtcSurfaceView
              canvas={{ uid: remoteUid }}
              style={styles.videoView}
            />
            <Text>Remote user uid: {remoteUid}</Text>
          </>
        ) : (
          <Text>
            {isJoined
              ? "Waiting for remote user to join"
              : "Join a channel to start"}
          </Text>
        )}
        <Text style={styles.info}>{message}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#0055cc",
    margin: 5,
  },
  main: { flex: 1, alignItems: "center" },
  scroll: { flex: 1, backgroundColor: "#ddeeff", width: "100%" },
  scrollContainer: { alignItems: "center" },
  videoView: { width: "90%", height: 200 },
  btnContainer: { flexDirection: "row", justifyContent: "center" },
  toggleContainer: { flexDirection: "row", alignItems: "center", margin: 10 },
  head: { fontSize: 20 },
  info: { backgroundColor: "#ffffe0", paddingHorizontal: 8, color: "#0000ff" },
});

export default App;
