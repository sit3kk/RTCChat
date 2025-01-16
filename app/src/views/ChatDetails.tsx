import React, { useState } from "react";
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
import { AuthenticatedStackProp, ChatsStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/commonStyles";
import { useUserData } from "../store/UserDataProvider";
import { Message } from "../types/commonTypes";
import { useChatMessages } from "../hooks/useChatMessages";
import { getCallSessionId, sendMessage } from "../services/chatService";

interface ChatMessageItemProps {
  item: Message;
  userId: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ item, userId }) => {
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

type ChatDetailsRouteProp = RouteProp<ChatsStackParamList, "ChatDetails">;

const ChatDetails: React.FC<{ route: ChatDetailsRouteProp }> = ({ route }) => {
  const { chatId, contactId, contactName, contactAvatar } = route.params;
  const [newMessage, setNewMessage] = useState("");
  const { userId, userName } = useUserData();
  const navigation = useNavigation<AuthenticatedStackProp>();
  const messages = useChatMessages(chatId, userId);

  const initiateCall = async (callType: "audio" | "video") => {
    try {
      const callSessionId = await getCallSessionId(userId, contactId, callType);

      navigation.navigate("InteractionStack", {
        screen: callType === "audio" ? "AudioCall" : "VideoCall",
        params: {
          callData: {
            callPartner: {
              id: chatId,
              name: contactName,
              avatar: contactAvatar,
            },
            callType,
            callSessionId: callSessionId,
          },
        },
      });
    } catch (error) {
      console.error("initiateCall error:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return <ChatMessageItem item={item} userId={userId} />;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Chats", {
              screen: "ChatsList",
              params: {},
            })
          }
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contactName}</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => initiateCall("audio")}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="call-outline" size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => initiateCall("video")}>
            <Ionicons
              name="videocam-outline"
              size={24}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity
          onPress={async () => {
            await sendMessage(chatId, userId, userName, newMessage);
          }}
          style={{ marginLeft: 5 }}
        >
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
});
