import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useUserData } from "../store/UserDataProvider";
import SearchBar from "../components/ui/SearchBar";
import DiamondBackground from "../components/ui/DiamondBackground";
import ContactSection from "../components/ContactSection";
import { Contact } from "../types/commonTypes";
import { listenToContacts } from "../services/contactService";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = listenToContacts(userId, (newContacts) => {
      setContacts(newContacts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
    }, [])
  );

  const filteredContacts = useMemo(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    return filtered;
  }, [searchQuery, contacts]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading contacts: {error}</Text>
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

        {filteredContacts.length > 0 ? (
          <ContactSection contactsData={filteredContacts} />
        ) : (
          <Text style={styles.noContactsText}>No contacts found</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: "flex-start",
    gap: 25,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  noContactsText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "gray",
  },
});

export default ContactsScreen;
