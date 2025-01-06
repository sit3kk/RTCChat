import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import { CallData } from "../types/commonTypes";
import Button from "../components/ui/Button";

interface IncomingCallScreenProps {
  callData: CallData;
  onAccept: () => void;
  onAcceptAudio: () => void;
  onReject: () => void;
}

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  callData,
  onAccept,
  onAcceptAudio,
  onReject,
}) => {
  const { callPartner, callType } = callData;
  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <View style={styles.callInfoContainer}>
          <Image source={{ uri: callPartner.avatar }} style={styles.avatar} />
          <Text style={styles.infoText}>Incoming {callType} call</Text>
          <Text style={styles.callPartnerName}>{callPartner.name}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Reject"
            onPress={onReject}
            type="reject"
            width={100}
            height={50}
          />
          <Button
            title="Accept Video"
            onPress={onAccept}
            type="accept"
            width={100}
            height={50}
          />
        </View>
        <Button
          title="Accept Audio"
          onPress={onAcceptAudio}
          type="accept"
          width={100}
          height={50}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  callInfoContainer: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  infoText: {
    fontSize: 20,
    color: Colors.textLight,
  },
  callPartnerName: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  buttonsContainer: {
    marginTop: 250,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});

export default IncomingCallScreen;
