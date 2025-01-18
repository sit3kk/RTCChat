import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { AuthenticatedStackProp, ChatsStackParamList } from "../../App";
import { Colors } from "../styles/commonStyles";
import { useUserData } from "../store/UserDataProvider";
import { Message } from "../types/commonTypes";
import { useChatMessages } from "../hooks/useChatMessages";
import { getCallSessionId, sendMessage } from "../services/ChatService";
import DiamondBackground from "../components/ui/DiamondBackground";
import IconButton from "../components/ui/IconButton";
import FlatTextInput from "../components/ui/FlatTextInput";

interface ChatHeaderProps {
  contactName: string;
  contactAvatar: string;
}

interface ChatHeaderProps {
  contactName: string;
  contactAvatar: string;
  onInitiateCall: (callType: "audio" | "video") => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  contactName,
  contactAvatar,
  onInitiateCall,
}) => {
  const navigation = useNavigation<AuthenticatedStackProp>();

  return (
    <View style={styles.header}>
      <IconButton
        name="arrow-back"
        size={24}
        onPress={() =>
          navigation.navigate("Chats", {
            screen: "ChatsList",
            params: {},
          })
        }
      />
      <View style={styles.headerNameWrapper}>
        <Image source={{ uri: contactAvatar }} style={styles.headerAvatar} />
        <Text style={styles.headerName}>{contactName}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 15 }}>
        <IconButton
          name="call-outline"
          size={24}
          onPress={() => onInitiateCall("audio")}
        />
        <IconButton
          name="videocam-outline"
          size={24}
          onPress={() => onInitiateCall("video")}
        />
      </View>
    </View>
  );
};

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

  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
      style={styles.container}
    >
      <>
        <DiamondBackground />
        <ChatHeader
          contactName={contactName}
          contactAvatar={contactAvatar}
          onInitiateCall={initiateCall}
        />

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <IconButton name="image-outline" size={28} onPress={() => {}} />
          <FlatTextInput
            isDarkMode={true}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={{ marginLeft: 5, color: Colors.textLight }}
            width={"80%"}
          />
          <IconButton
            name="send"
            size={28}
            color={Colors.primary}
            onPress={async () => {
              await sendMessage(chatId, userId, userName, newMessage);
              setNewMessage("");
            }}
          />
        </View>
      </>
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
  headerNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
    marginLeft: 45,
  },
  headerAvatar: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#333",
    backgroundColor: Colors.background,
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
