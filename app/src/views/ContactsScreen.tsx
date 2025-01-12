import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, DeviceEventEmitter } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useUserData } from "../store/UserDataProvider";
import SearchBar from "../components/ui/SearchBar";
import { Colors } from "../styles/commonStyles";
import DiamondBackground from "../components/ui/DiamondBackground";
import ContactSection from "../components/ContactSection";
import { Contact } from "../types/commonTypes";
import { fetchContacts } from "../api/FirestoreGateway";
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";

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

    // listen for contact added event
    const subscription = DeviceEventEmitter.addListener(
      "onContactAdded",
      () => loadData
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    // clear the search query whenever the screen is focused
    useCallback(() => {
      setSearchQuery("");
    }, [])
  );

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  }, [searchQuery, contacts]);

  if (loading) {
    return <LoadingScreen />;
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
