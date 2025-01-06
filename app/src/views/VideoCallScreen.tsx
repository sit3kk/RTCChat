import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import VideoCallControls from "../components/VideoCallControls";
import { Ionicons } from "@expo/vector-icons";
import DiamondBackground from "../components/ui/DiamondBackground";
import { Colors } from "../styles/commonStyles";
import DefaultCallControls from "../components/DefaultCallControls";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { InteractionStackParamList } from "../../App";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";

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
  const callPartner = callData.callPartner;

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  const handleSpeakerToggle = () => {
    setSpeakerOn(!speakerOn);
  };

  const handleEndCall = () => {
    console.log("Call ended");
    navigation.goBack();
  };

  const handleCameraToggle = () => {
    setCameraOn(!cameraOn);
  };

  const handleSwapCamera = () => {
    console.log("Camera swapped");
  };

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
    // TODO: Add listener for call state changes
    setIsCallActive(true);
  }, []);
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
            // TODO: Add video stream component here
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
            {cameraOn && (
              // TODO: Add video stream component here
              <Ionicons name="camera" size={80} color={Colors.textLight} />
            )}
            {!cameraOn && (
              <>
                <Image
                  source={{ uri: callPartner.avatar }}
                  style={styles.avatar}
                />
                <Text style={styles.cameraStatus}>
                  {callPartner.name}
                  {"\n"}has turned off their camera.
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
  callPartnerContainer: {
    alignItems: "center",
    marginBottom: 150,
  },
  avatarSmall: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: Colors.primary,
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
  callType: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 5,
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

export default VideoCallScreen;
