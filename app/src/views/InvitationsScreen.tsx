import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, DeviceEventEmitter } from "react-native";
import { useUserData } from "../store/UserDataProvider";
import { Invitation } from "../types/commonTypes";
import {
  fetchInvitations,
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
} from "../services/contactService";
import { SafeAreaView } from "react-native-safe-area-context";
import DiamondBackground from "../components/ui/DiamondBackground";
import LoadingScreen from "./LoadingScreen";
import PendingInvitations from "../components/PendingInvitations";
import InviteForm from "../components/InviteForm";
import { mockInvitations } from "../tests/mockData";
import { AuthenticatedStackProp } from "../../App";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../components/ui/IconButton";
import { Colors } from "../styles/commonStyles";

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
  const [invitationCode, setInvitationCode] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedInvitations = await fetchInvitations(userId);
      setInvitations(fetchedInvitations);
      // setInvitations(mockInvitations);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
      setStatus("Failed to load invitations.");
    }
    setLoading(false);
  };

  const handleSendInvitation = async () => {
    if (invitationCode.length !== 4) {
      setStatus("Invitation code must be 4 characters long.");
      return;
    }
    const response = await sendInvitation(userId, userName, invitationCode);
    if (response.success) {
      setStatus("Invitation sent!");
      setInvitationCode("");
    } else {
      console.error("Error sending invitation:", response.message);
      setStatus(response.message);
    }
  };

  const handleAcceptInvitation = async (
    invitationId: string,
    fromUserId: string
  ) => {
    try {
      await acceptInvitation(userId, invitationId, fromUserId);
      setStatus("Invitation accepted!");
      loadData();
      DeviceEventEmitter.emit("onContactAdded");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setStatus("Failed to accept invitation.");
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await rejectInvitation(invitationId);
      setStatus("Invitation rejected.");
      loadData();
      DeviceEventEmitter.emit("onContactAdded");
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      setStatus("Failed to reject invitation.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
