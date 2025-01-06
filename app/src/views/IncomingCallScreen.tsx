import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import { CallData } from "../types/commonTypes";
import Button from "../components/ui/Button";

interface IncomingCallScreenProps {
  callData: CallData;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  callData,
  onAccept,
  onReject,
}) => {
  const { caller, callType } = callData;
  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <View style={styles.callInfoContainer}>
          <Image source={{ uri: caller.avatar }} style={styles.avatar} />
          <Text style={styles.infoText}>Incoming {callType} call</Text>
          <Text style={styles.callerName}>{caller.name}</Text>
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
            title="Accept"
            onPress={onAccept}
            type="accept"
            width={100}
            height={50}
          />
        </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 20,
    color: Colors.textLight,
  },
  callerName: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  callerNumber: {
    fontSize: 18,
    color: Colors.textDimmed,
    marginTop: 5,
  },
  buttonsContainer: {
    marginTop: 250,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});

export default IncomingCallScreen;
