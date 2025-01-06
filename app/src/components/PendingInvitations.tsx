import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Colors } from "../styles/commonStyles";
import { Invitation } from "../types/commonTypes";
import Button from "./ui/Button";

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
      <Text>Invitation from: {item.fromUserName}</Text>
      <View style={styles.buttons}>
        <Button
          title="Accept"
          onPress={() => handleAcceptInvitation(item.id, item.fromUserId)}
        />
        <Button
          title="Reject"
          onPress={() => handleRejectInvitation(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Pending Invitations</Text>
      <FlatList
        data={invitations}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
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
  flatListContainer: {
    paddingBottom: 20,
  },
  invitationItem: {
    padding: 15,
    backgroundColor: Colors.primaryTransparent,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default PendingInvitations;
