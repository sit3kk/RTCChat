import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { db } from "../api/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useUserData } from "../store/UserDataProvider";

type Contact = {
  id: string;
  name: string;
};

type Invitation = {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: string;
};

export type BottomTabParamList = {
  Contacts: undefined;
  Home: undefined;
  InviteFriends: undefined;
  Settings: undefined;
};

type ContactsScreenProps = BottomTabScreenProps<BottomTabParamList, "Contacts">;

const ContactsScreen: React.FC<ContactsScreenProps> = () => {
  const { userId, userName } = useUserData();

  const [invitationCode, setInvitationCode] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchContacts(userId), fetchInvitations(userId)]);
    setLoading(false);
  };

  const fetchContacts = async (userId: string) => {
    try {
      const contactsQuery = query(
        collection(db, "contacts"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(contactsQuery);

      const contacts: Contact[] = [];
      for (const contactDoc of querySnapshot.docs) {
        const contactData = contactDoc.data();
        const contactUserId = contactData.contactId;

        const contactUserRef = doc(db, "users", contactUserId);
        const contactUserDoc = await getDoc(contactUserRef);

        if (contactUserDoc.exists()) {
          const userData = contactUserDoc.data() as { name: string };
          contacts.push({
            id: contactDoc.id,
            name: userData.name,
          });
        }
      }
      setContacts(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchInvitations = async (userId: string) => {
    try {
      const invitationsQuery = query(
        collection(db, "invitations"),
        where("toUserId", "==", userId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(invitationsQuery);

      const fetchedInvitations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invitation[];
      setInvitations(fetchedInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleSendInvitation = async () => {
    if (invitationCode.length !== 4) {
      setStatus("Invitation code must be 4 characters long.");
      return;
    }
    try {
      const userQuery = query(
        collection(db, "users"),
        where("invitationCode", "==", invitationCode)
      );
      const userSnapshot = await getDocs(userQuery);
      if (userSnapshot.empty) {
        setStatus("No user found with this code.");
        return;
      }

      const toUserId = userSnapshot.docs[0].id;
      const toUserName = userSnapshot.docs[0].data().name;

      await addDoc(collection(db, "invitations"), {
        fromUserId: userId,
        fromUserName: userName,
        toUserId,
        toUserName,
        status: "pending",
      });

      setStatus("Invitation sent!");
      setInvitationCode("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      setStatus("Failed to send invitation.");
    }
  };

  const handleAcceptInvitation = async (
    invitationId: string,
    fromUserId: string
  ) => {
    try {
      const invitationRef = doc(db, "invitations", invitationId);
      await updateDoc(invitationRef, { status: "accepted" });

      await addDoc(collection(db, "contacts"), {
        userId,
        contactId: fromUserId,
      });
      await addDoc(collection(db, "contacts"), {
        userId: fromUserId,
        contactId: userId,
      });

      setStatus("Invitation accepted!");
      loadData();
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      const invitationRef = doc(db, "invitations", invitationId);
      await deleteDoc(invitationRef);
      setStatus("Invitation rejected.");
      loadData();
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    }
  };

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
          color="red"
          onPress={() => handleRejectInvitation(item.id)}
        />
      </View>
    </View>
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <Text>{item.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts</Text>
      <TextInput
        style={styles.input}
        value={invitationCode}
        onChangeText={setInvitationCode}
        placeholder="Enter friend's code"
        maxLength={4}
      />
      <Button title="Add Friend" onPress={handleSendInvitation} />
      {status && <Text style={styles.status}>{status}</Text>}
      <Text style={styles.subHeader}>Pending Invitations</Text>
      <FlatList
        data={invitations}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.subHeader}>Your Contacts</Text>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  status: {
    color: "green",
    marginBottom: 10,
  },
  invitationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "column",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

export default ContactsScreen;
