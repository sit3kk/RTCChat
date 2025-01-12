import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../api/FirebaseConfig";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";
import VideoCallControls from "../components/VideoCallControls";
import DefaultCallControls from "../components/DefaultCallControls";
import { Ionicons } from "@expo/vector-icons";
import { InteractionStackParamList } from "../../App";

type VideoCallRouteProp = RouteProp<InteractionStackParamList, "VideoCall">;

interface VideoCallScreenProps {
  route: VideoCallRouteProp;
}

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ route }) => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const navigation = useNavigation();
  const { callData } = route.params;
  const { callPartner, callSessionId } = callData;

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

  // Call Agora logic for video
  // useEffect(() => {
  //   // joinAgoraChannelVideo(...)
  //   // ...
  // }, []);

  const handleEndCall = async () => {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "ended",
    });
    navigation.goBack();
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    // logic for muting in Agora
  };

  const handleSpeakerToggle = () => {
    setSpeakerOn(!speakerOn);
    // logic for speaker phone
  };

  const handleCameraToggle = () => {
    setCameraOn(!cameraOn);
    // logic for turning on/off local video
  };

  const handleSwapCamera = () => {
    console.log("Camera swapped");
    // logic for switching front/back camera
  };

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
          {cameraOn && (
            // wstaw tutaj np. <AgoraVideoView ... />
            <Ionicons name="camera" size={80} color={Colors.textLight} />
          )}
          {!cameraOn && (
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
            <Image source={{ uri: callPartner.avatar }} style={styles.avatar} />
            <Text style={styles.cameraStatus}>
              {callPartner.name} - Remote Video
            </Text>
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
