import React from "react";
import ReactNative, { View, Text, FlatList, StyleSheet } from "react-native";
import { Colors } from "../styles/commonStyles";
import { Invitation } from "../types/commonTypes";
import FlatButton from "./ui/FlatButton";

interface PendingInvitationsProps {
  invitations: Invitation[];
  handleAcceptInvitation: (id: string, fromUserId: string) => void;
  handleRejectInvitation: (id: string) => void;
}

const PendingInvitations: React.FC<PendingInvitationsProps> = ({
  invitations,
  handleAcceptInvitation,
  handleRejectInvitation,
}) => {
  const renderInvitation = ({ item }: { item: Invitation }) => (
    <View style={styles.invitationItem}>
      <Text style={styles.invitationText}>{item.fromUserName}</Text>
      <View style={styles.buttons}>
        <FlatButton
          title="Accept"
          color={Colors.textLight}
          onPress={() => handleAcceptInvitation(item.id, item.fromUserId)}
        />
        <FlatButton
          title="Reject"
          color={Colors.danger}
          onPress={() => handleRejectInvitation(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Pending Invitations</Text>
      {invitations.length === 0 && (
        <FlatList
          data={invitations}
          renderItem={renderInvitation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
      {invitations.length === 0 && (
        <Text style={styles.text}>No pending invitations.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
    marginBottom: 15,
  },
  text: {
    color: Colors.textLight,
    textAlign: "center",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  invitationItem: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: Colors.secondaryTransparent,
    alignItems: "center",
    marginVertical: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  invitationText: {
    color: Colors.textLight,
    fontWeight: "bold",
    left: 5,
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default PendingInvitations;
