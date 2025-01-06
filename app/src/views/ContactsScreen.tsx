import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useUserData } from "../store/UserDataProvider";
import SearchBar from "../components/ui/SearchBar";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import ContactSection from "../components/ContactSection";
import { Contact } from "../types/ContactData";
import { fetchContacts } from "../api/FirestoreGateway";

export type BottomTabParamList = {
  Contacts: undefined;
  Home: undefined;
  InviteFriends: undefined;
  Settings: undefined;
};

type ContactsScreenProps = BottomTabScreenProps<BottomTabParamList, "Contacts">;

const ContactsScreen: React.FC<ContactsScreenProps> = () => {
  const { userId } = useUserData();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setContacts(await fetchContacts(userId));
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  }, [searchQuery, contacts]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          autoComplete="off"
          keyboardType="default"
          autoCorrect={false}
        />

        <Text style={styles.subHeader}>Contact list</Text>
        <ContactSection contactsData={filteredContacts} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ContactsScreen;

// type Invitation = {
//   id: string;
//   fromUserId: string;
//   fromUserName: string;
//   toUserId: string;
//   toUserName: string;
//   status: string;
// };

// const [invitationCode, setInvitationCode] = useState("");
// const [invitations, setInvitations] = useState<Invitation[]>([]);
// const [status, setStatus] = useState("");
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   loadData();
// }, []);

// const loadData = async () => {
//   setLoading(true);
//   await Promise.all([fetchContacts(userId), fetchInvitations(userId)]);
//   setLoading(false);
// };

// const fetchInvitations = async (userId: string) => {
//   try {
//     const invitationsQuery = query(
//       collection(db, "invitations"),
//       where("toUserId", "==", userId),
//       where("status", "==", "pending")
//     );
//     const querySnapshot = await getDocs(invitationsQuery);

//     const fetchedInvitations = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Invitation[];
//     setInvitations(fetchedInvitations);
//   } catch (error) {
//     console.error("Error fetching invitations:", error);
//   }
// };

// const handleSendInvitation = async () => {
//   if (invitationCode.length !== 4) {
//     setStatus("Invitation code must be 4 characters long.");
//     return;
//   }
//   try {
//     const userQuery = query(
//       collection(db, "users"),
//       where("invitationCode", "==", invitationCode)
//     );
//     const userSnapshot = await getDocs(userQuery);
//     if (userSnapshot.empty) {
//       setStatus("No user found with this code.");
//       return;
//     }

//     const toUserId = userSnapshot.docs[0].id;
//     const toUserName = userSnapshot.docs[0].data().name;

//     await addDoc(collection(db, "invitations"), {
//       fromUserId: userId,
//       fromUserName: userName,
//       toUserId,
//       toUserName,
//       status: "pending",
//     });

//     setStatus("Invitation sent!");
//     setInvitationCode("");
//   } catch (error) {
//     console.error("Error sending invitation:", error);
//     setStatus("Failed to send invitation.");
//   }
// };

// const handleAcceptInvitation = async (
//   invitationId: string,
//   fromUserId: string
// ) => {
//   try {
//     const invitationRef = doc(db, "invitations", invitationId);
//     await updateDoc(invitationRef, { status: "accepted" });

//     await addDoc(collection(db, "contacts"), {
//       userId,
//       contactId: fromUserId,
//     });
//     await addDoc(collection(db, "contacts"), {
//       userId: fromUserId,
//       contactId: userId,
//     });

//     setStatus("Invitation accepted!");
//     loadData();
//   } catch (error) {
//     console.error("Error accepting invitation:", error);
//   }
// };

// const handleRejectInvitation = async (invitationId: string) => {
//   try {
//     const invitationRef = doc(db, "invitations", invitationId);
//     await deleteDoc(invitationRef);
//     setStatus("Invitation rejected.");
//     loadData();
//   } catch (error) {
//     console.error("Error rejecting invitation:", error);
//   }
// };

// const renderInvitation = ({ item }: { item: Invitation }) => (
//   <View style={styles.invitationItem}>
//     <Text>Invitation from: {item.fromUserName}</Text>
//     <View style={styles.buttons}>
//       <Button
//         title="Accept"
//         onPress={() => handleAcceptInvitation(item.id, item.fromUserId)}
//       />
//       <Button
//         title="Reject"
//         color="red"
//         onPress={() => handleRejectInvitation(item.id)}
//       />
//     </View>
//   </View>
// );

// {
//   /* <TextInput
//         style={styles.input}
//         value={invitationCode}
//         onChangeText={setInvitationCode}
//         placeholder="Enter friend's code"
//         maxLength={4}
//       />
//       <Button title="Add Friend" onPress={handleSendInvitation} />
//       {status && <Text style={styles.status}>{status}</Text>}
//       <Text style={styles.subHeader}>Pending Invitations</Text>
//       <FlatList
//         data={invitations}
//         renderItem={renderInvitation}
//         keyExtractor={(item) => item.id}
//       /> */
// }

// status: {
//     color: "green",
//     marginBottom: 10,
//   },
//   invitationItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     flexDirection: "column",
//   },
//   buttons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
