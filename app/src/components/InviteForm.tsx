import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../styles/commonStyles";
import FlatTextInput from "./ui/FlatTextInput";
import Button from "./ui/Button";

interface InviteFormProps {
  invitationCode: string;
  setInvitationCode: (code: string) => void;
  handleSendInvitation: () => void;
  status: string | null;
}

const InviteForm: React.FC<InviteFormProps> = ({
  invitationCode,
  setInvitationCode,
  handleSendInvitation,
  status,
}) => {
  return (
    <View style={styles.newInviteContainer}>
      <Text style={styles.subHeader}>Add New Friends</Text>

      <View style={styles.rowContainer}>
        <FlatTextInput
          value={invitationCode}
          onChangeText={setInvitationCode}
          placeholder="Enter friend's code"
          textAlign="center"
          maxLength={4}
          width="60%"
        />
        <Button
          title="Add Friend"
          onPress={handleSendInvitation}
          type="primary"
          width={30}
        />
      </View>

      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  newInviteContainer: {
    position: "absolute",
    top: 20,
    left: 5,
    right: 5,
    padding: 10,
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 10,
    backgroundColor: Colors.secondaryTransparent,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  subHeader: {
    alignSelf: "flex-start",
    left: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
    marginTop: 20,
    marginBottom: 10,
  },
  status: {
    color: Colors.textLight,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default InviteForm;
