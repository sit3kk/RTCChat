import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUserData } from "../store/UserDataProvider";
import {
  listenForInvitations,
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
} from "../services/contactService";
import { Invitation } from "../types/commonTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import DiamondBackground from "../components/ui/DiamondBackground";
import LoadingScreen from "./LoadingScreen";
import PendingInvitations from "../components/PendingInvitations";
import InviteForm from "../components/InviteForm";
import { Colors } from "../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import { AuthenticatedStackProp } from "../../App";
import IconButton from "../components/ui/IconButton";

const InvitationsHeader: React.FC = () => {
  const navigation = useNavigation<AuthenticatedStackProp>();
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", gap: 15 }}>
        <IconButton
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontSize: 18, color: Colors.textLight }}>Back</Text>
      </View>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: Colors.textLight,
        }}
      >
        Invitations
      </Text>
    </View>
  );
};

const InvitationsScreen: React.FC = () => {
  const { userId, userName } = useUserData();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationCode, setInvitationCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenForInvitations(userId, (newInvitations) => {
      setInvitations(newInvitations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleSendInvitation = async () => {
    if (invitationCode.length !== 4) {
      setStatus("Invitation code must be 4 characters long.");
      return;
    }

    try {
      await sendInvitation(userId, userName, invitationCode);
      setStatus("Invitation sent successfully!");
      setInvitationCode("");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleAcceptInvitation = async (
    invitationId: string,
    fromUserId: string
  ) => {
    try {
      await acceptInvitation(userId, invitationId, fromUserId);
      setStatus("Invitation accepted!");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await rejectInvitation(invitationId);
      setStatus("Invitation rejected.");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <DiamondBackground />
      <SafeAreaView style={styles.container}>
        <InvitationsHeader />
        {loading && <LoadingScreen />}
        {!loading && (
          <View style={styles.innerContainer}>
            <InviteForm
              invitationCode={invitationCode}
              setInvitationCode={setInvitationCode}
              handleSendInvitation={handleSendInvitation}
              status={status}
            />

            <PendingInvitations
              invitations={invitations}
              handleAcceptInvitation={handleAcceptInvitation}
              handleRejectInvitation={handleRejectInvitation}
            />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 220,
  },
});

export default InvitationsScreen;
