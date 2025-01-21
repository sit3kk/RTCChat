import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { updateCallStatus } from "../services/callSessionService";
import useAgora from "../hooks/useAgora";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import { formatCallDuration } from "../utils/utils";
import InactiveCallOverlay from "../components/InactiveCallOverlay";
import VideoCallControls from "../components/VideoCallControls";
import DefaultCallControls from "../components/DefaultCallControls";
import { Ionicons } from "@expo/vector-icons";
import { InteractionStackParamList } from "../../App";
import { RtcSurfaceView } from "react-native-agora";

interface VideoCallScreenProps {
  route: RouteProp<InteractionStackParamList, "VideoCall">;
}

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { callData } = route.params;
  const { callPartner, callSessionId, callType } = callData;

  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const {
    isJoined,
    remoteUid,
    toggleMute,
    setSpeakerphoneOn,
    toggleCamera,
    switchCamera,
    leaveChannel,
  } = useAgora(callType);

  useEffect(() => {
    const unsubscribe = updateCallStatus(callSessionId, "joined");
    return () => {
      unsubscribe.then(async () => {
        await updateCallStatus(callSessionId, "ended");
        setIsCallActive(false);
      });
    };
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

  function handleCameraToggle() {
    toggleCamera(!cameraOn);
    setCameraOn((cameraOn) => !cameraOn);
  }

  function handleSwapCamera() {
    switchCamera();
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
            {remoteUid !== 0 ? ( // TODO: tmp condition for remoteUid
              <RtcSurfaceView
                style={{ width: "100%", height: "100%" }}
                canvas={{ uid: remoteUid }} // TODO: we assume that uid is at index 0
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
  },
});
