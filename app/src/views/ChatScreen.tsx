import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../api/FirebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp;
};

type Contact = {
  id: string;
  name: string;
};

type BottomTabParamList = {
  Contacts: { userId: string; userName: string };
  Home: undefined;
  Chat: { chatId: string; userId: string; userName: string };
};

type ChatScreenProps = BottomTabScreenProps<BottomTabParamList, "Chat">;

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { userId, userName } = route.params;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchContacts(userId);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      return fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContacts = async (userId: string) => {
    try {
      const contactsQuery = query(
        collection(db, "contacts"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(contactsQuery);

      const fetchedContacts: Contact[] = [];

      for (const contactDoc of querySnapshot.docs) {
        const contactData = contactDoc.data();
        const contactUserId = contactData.contactId;

        const userRef = doc(db, "users", contactUserId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as { name: string };
          fetchedContacts.push({
            id: contactUserId,
            name: userData.name,
          });
        }
      }

      setContacts(fetchedContacts);
      setSelectedContact(fetchedContacts[0] || null);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchMessages = (contactId: string) => {
    setLoading(true);

    const chatId = [userId, contactId].sort().join("_");

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(fetchedMessages);
      setLoading(false);
    });

    return unsubscribe;
  };

  const sendMessage = async () => {
    if (!selectedContact || newMessage.trim() === "") return;

    const chatId = [userId, selectedContact.id].sort().join("_");

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: userId,
        senderName: userName,
        text: newMessage,
        createdAt: Timestamp.now(),
      });

      setNewMessage("");
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === userId
          ? styles.myMessageContainer
          : styles.otherMessageContainer,
      ]}
    >
      <Text style={styles.senderName}>
        {item.senderId === userId ? "You" : item.senderName}
      </Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.contactPicker}>
        <Text>Select a contact:</Text>
        <Picker
          selectedValue={selectedContact?.id}
          onValueChange={(itemValue: string) => {
            const contact = contacts.find((c) => c.id === itemValue) || null;
            setSelectedContact(contact);
          }}
        >
          {contacts.map((contact) => (
            <Picker.Item
              key={contact.id}
              label={contact.name}
              value={contact.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.messagesContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000FF" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contactPicker: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
});
