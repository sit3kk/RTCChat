import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Colors } from "../styles/commonStyles";
import { InteractionStackParamList } from "../../App";
import DiamondBackground from "../components/ui/DiamondBackground";
import CallControls from "../components/CallControls";
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
    setMuted((prev) => !prev);
  };

  const handleSpeakerToggle = () => {
    setSpeakerOn((prev) => !prev);
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

        <CallControls
          muted={muted}
          speakerOn={speakerOn}
          onMuteToggle={handleMuteToggle}
          onSpeakerToggle={handleSpeakerToggle}
          onEndCall={handleEndCall}
        />
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
});

export default ActiveAudioCallScreen;
