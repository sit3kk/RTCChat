import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../api/FirebaseConfig";
import { ChatsStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";
import { useUserData } from "../store/UserDataProvider";

type ChatDetailsRouteProp = RouteProp<ChatsStackParamList, "ChatDetails">;

type Message = {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  readBy?: string[];
};

const ChatDetails: React.FC<{ route: ChatDetailsRouteProp }> = ({ route }) => {
  const { chatId, contactName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId, userName } = useUserData();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = () => {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);

        markAsRead(snapshot.docs);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchMessages();
    return () => unsubscribe();
  }, [chatId]);

  const markAsRead = async (docs: any[]) => {
    docs.forEach(async (docSnap) => {
      const msgData = docSnap.data() as Message;
      if (!msgData.readBy?.includes(userId) && msgData.senderId !== userId) {
        try {
          await updateDoc(doc(db, "chats", chatId, "messages", docSnap.id), {
            readBy: arrayUnion(userId),
          });
        } catch (err) {
          console.error("markAsRead error:", err);
        }
      }
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: userId,
        username: userName,
        text: newMessage,
        createdAt: Timestamp.now(),
        readBy: [userId],
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === userId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ChatsList")}>
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contactName}</Text>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={{ marginHorizontal: 5 }}>
          <Ionicons name="image-outline" size={28} color="#888" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 5 }}>
          <Ionicons name="send" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: "75%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
  },
  messageText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#333",
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 25,
    color: Colors.textLight,
    backgroundColor: "#222",
  },
});
