import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchChats } from "../api/FirestoreGateway";
import { useUserData } from "../store/UserDataProvider";
import { Colors } from "../styles/commonStyles";
import { ChatsStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/ui/SearchBar";
import LoadingScreen from "./LoadingScreen";
import DiamondBackground from "../components/ui/DiamondBackground";
import SegmentedControl from "../components/ui/SegmentedControl";
import { ChatItem } from "../types/commonTypes";

const ChatItemComponent: React.FC<{
  chat: ChatItem;
  onPress: () => void;
}> = ({ chat, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <View style={styles.avatar}>
      {chat.avatar ? (
        <Image source={{ uri: chat.avatar }} style={styles.contactAvatar} />
      ) : (
        <Ionicons name="person" size={24} color={Colors.textAccent} />
      )}
    </View>
    <View style={styles.chatInfo}>
      <Text style={styles.contactName}>{chat.contactName}</Text>
      <Text style={styles.lastMessage}>
        {chat.lastMessageText || "Start a conversation"}
      </Text>
    </View>
    {chat.unreadCount ? (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

export type ChatsNavigationProp = StackNavigationProp<
  ChatsStackParamList,
  "ChatsScreen"
>;

const filterChatsData = (
  chats: ChatItem[],
  selectedTab: "All" | "Unread",
  searchText: string
): ChatItem[] => {
  let filtered = chats;
  if (selectedTab === "Unread") {
    filtered = filtered.filter((chat) => (chat.unreadCount ?? 0) > 0);
  }
  if (searchText.trim()) {
    const lowerSearch = searchText.toLowerCase();
    filtered = filtered.filter((chat) =>
      chat.contactName.toLowerCase().includes(lowerSearch)
    );
  }
  return filtered;
};

const ChatsScreen: React.FC = () => {
  const { userId } = useUserData();
  const navigation = useNavigation<ChatsNavigationProp>();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"All" | "Unread">("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        setChats(await fetchChats(userId));
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const result = filterChatsData(chats, selectedTab, searchText);
    setFilteredChats(result);
  }, [chats, selectedTab, searchText]);

  const getChatId = (contactId: string) => [userId, contactId].sort().join("_");

  const renderChatItem = useCallback(
    ({ item }: { item: ChatItem }) => (
      <ChatItemComponent
        chat={item}
        onPress={() =>
          navigation.navigate("ChatDetails", {
            chatId: getChatId(item.contactId),
            contactName: item.contactName,
            contactId: item.contactId,
          })
        }
      />
    ),
    [navigation, userId]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <DiamondBackground />
      <View style={styles.container}>
        <SearchBar
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="words"
          autoComplete="off"
          keyboardType="default"
          autoCorrect={false}
        />

        <Text style={styles.headerText}>Contact list</Text>
        <SegmentedControl
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.contactId}
        />
      </View>
    </>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: "flex-start",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
    marginTop: 20,
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  chatInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textDimmed,
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
});
