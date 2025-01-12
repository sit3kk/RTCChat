import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { db } from "../api/FirebaseConfig";
import { useUserData } from "../store/UserDataProvider";
import { Colors } from "../styles/commonStyles";
import { ChatsStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type ChatItem = {
  contactId: string;
  contactName: string;
  avatar?: string;
  lastMessageText?: string;
  lastMessageDate?: number;
  unreadCount?: number;
  createdAt?: number;
};

export type ChatsNavigationProp = StackNavigationProp<
  ChatsStackParamList,
  "ChatsList"
>;

const ChatsList: React.FC = () => {
  const { userId } = useUserData();
  const navigation = useNavigation<ChatsNavigationProp>();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"All" | "Unread">("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    filterChats();
  }, [chats, selectedTab, searchText]);

  const fetchChats = async () => {
    try {
      setLoading(true);

      const contactsRef = collection(db, "contacts");
      const q = query(contactsRef, where("userId", "==", userId));
      const contactsSnapshot = await getDocs(q);

      const allChats: ChatItem[] = [];
      const chatPromises: Promise<void>[] = [];

      for (const docSnap of contactsSnapshot.docs) {
        const contactData = docSnap.data() as {
          contactId: string;
          createdAt?: any;
        };

        const contactUserRef = doc(db, "users", contactData.contactId);
        const contactUserSnapshot = await getDoc(contactUserRef);

        let contactName = "Unknown";
        let avatar = "";
        if (contactUserSnapshot.exists()) {
          const userInfo = contactUserSnapshot.data() as {
            name: string;
            profilePic?: string;
          };
          contactName = userInfo.name;
          avatar = userInfo.profilePic || "";
        }

        const chatId = [userId, contactData.contactId].sort().join("_");
        const messagesRef = collection(db, "chats", chatId, "messages");
        const msgQuery = query(messagesRef, orderBy("createdAt", "desc"));

        const chatPromise = new Promise<void>((resolve) => {
          onSnapshot(msgQuery, (snapshot) => {
            if (!snapshot.empty) {
              const lastMsgDoc = snapshot.docs[0];
              const lastMsgData = lastMsgDoc.data() as {
                text: string;
                createdAt: { seconds: number; nanoseconds: number };
                readBy?: string[];
                senderId: string;
              };

              const lastMsgDate = lastMsgData.createdAt
                ? lastMsgData.createdAt.seconds * 1000
                : 0;

              let unreadCount = 0;
              snapshot.docs.forEach((m) => {
                const mData = m.data() as {
                  readBy?: string[];
                  senderId: string;
                };
                if (
                  !mData.readBy?.includes(userId) &&
                  mData.senderId !== userId
                ) {
                  unreadCount++;
                }
              });

              updateChatInArray(allChats, {
                contactId: contactData.contactId,
                contactName,
                avatar,
                lastMessageText: lastMsgData.text,
                lastMessageDate: lastMsgDate,
                unreadCount,
                createdAt: contactData.createdAt
                  ? contactData.createdAt.seconds * 1000
                  : 0,
              });
            } else {
              updateChatInArray(allChats, {
                contactId: contactData.contactId,
                contactName,
                avatar,
                lastMessageText: "",
                lastMessageDate: 0,
                unreadCount: 0,
                createdAt: contactData.createdAt
                  ? contactData.createdAt.seconds * 1000
                  : 0,
              });
            }

            resolve();
          });
        });

        chatPromises.push(chatPromise);
      }

      await Promise.all(chatPromises);

      const sortedChats = allChats.sort((a, b) => {
        if ((b.lastMessageDate || 0) !== (a.lastMessageDate || 0)) {
          return (b.lastMessageDate || 0) - (a.lastMessageDate || 0);
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      setChats(sortedChats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setLoading(false);
    }
  };

  const updateChatInArray = (chatsArr: ChatItem[], newItem: ChatItem) => {
    const index = chatsArr.findIndex((c) => c.contactId === newItem.contactId);
    if (index >= 0) {
      chatsArr[index] = newItem;
    } else {
      chatsArr.push(newItem);
    }
  };

  const filterChats = () => {
    const sorted = [...chats].sort((a, b) => {
      if ((b.lastMessageDate || 0) !== (a.lastMessageDate || 0)) {
        return (b.lastMessageDate || 0) - (a.lastMessageDate || 0);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    let result = sorted;

    if (selectedTab === "Unread") {
      result = result.filter((chat) => (chat.unreadCount ?? 0) > 0);
    }

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((chat) =>
        chat.contactName.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredChats(result);
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          navigation.navigate("ChatDetails", {
            chatId: [userId, item.contactId].sort().join("_"),
            contactName: item.contactName,
            contactId: item.contactId,
          });
        }}
      >
        <View style={styles.avatar}>
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              style={styles.contactAvatar}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={24} color="#fff" />
          )}
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.contactName}>{item.contactName}</Text>
          <Text style={styles.lastMessage}>
            {item.lastMessageText || "No messages yet"}
          </Text>
        </View>

        <Text>
          {item.unreadCount && item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.textDimmed}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          placeholderTextColor={Colors.textDimmed}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "All" ? styles.tabActive : undefined,
          ]}
          onPress={() => setSelectedTab("All")}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Unread" ? styles.tabActive : undefined,
          ]}
          onPress={() => setSelectedTab("Unread")}
        >
          <Text style={styles.tabText}>Unread</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.contactId}
      />
    </View>
  );
};

export default ChatsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textLight,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    backgroundColor: "#444",
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textLight,
    fontWeight: "600",
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
