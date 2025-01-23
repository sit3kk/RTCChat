import * as DbOps from "./dbOperations";
import { where, orderBy } from "firebase/firestore";
import { ChatItem, Message } from "../types/commonTypes";
import { randomAvatar } from "../utils/utils";

export const listenForChats = (
  userId: string,
  updateChats: (chats: ChatItem[]) => void
) => {
  return DbOps.onQuerySnapshot(
    "contacts",
    [where("userId", "==", userId)],
    async (contacts) => {
      const allChats: ChatItem[] = [];
      for (const contact of contacts) {
        const contactId = contact.contactId;
        const contactUserDoc = await DbOps.fetchDoc("users", contactId);
        const contactName = contactUserDoc.exists()
          ? contactUserDoc.data().name
          : "Unknown";
        const defaultAvatar = randomAvatar();
        const contactAvatar = contactUserDoc.exists()
          ? contactUserDoc.data().profilePic || defaultAvatar
          : defaultAvatar;

        const chatId = [userId, contactId].sort().join("_");

        DbOps.onQuerySnapshot(
          "chats/" + chatId + "/messages",
          [orderBy("createdAt", "desc")],
          (messages) => {
            if (messages.length > 0) {
              const lastMessage = messages[0];
              const unreadCount = messages.filter(
                (m) => !m.readBy?.includes(userId) && m.senderId !== userId
              ).length;
              const chatDetails = {
                contactId: contactId,
                contactName: contactName,
                contactAvatar: contactAvatar,
                lastMessageText: lastMessage.text,
                lastMessageDate: lastMessage.createdAt.seconds * 1000,
                unreadCount,
                createdAt: contact.createdAt?.seconds * 1000 || 0,
              };
              const index = allChats.findIndex(
                (chat) => chat.contactId === contactId
              );
              if (index >= 0) {
                allChats[index] = chatDetails;
              } else {
                allChats.push(chatDetails);
              }
            } else {
              allChats.push({
                contactId: contactId,
                contactName: contactName,
                contactAvatar: contactAvatar,
                lastMessageText: "",
                lastMessageDate: 0,
                unreadCount: 0,
                createdAt: contact.createdAt?.seconds * 1000 || 0,
              });
            }
            allChats.sort(
              (a, b) =>
                (b.lastMessageDate || b.createdAt || 0) -
                (a.lastMessageDate || a.createdAt || 0)
            );
            updateChats([...allChats]);
          }
        );
      }
    }
  );
};

export const fetchMessagesAndListen = (
  chatId: string,
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  return DbOps.onQuerySnapshot(
    "chats/" + chatId + "/messages",
    [orderBy("createdAt", "asc")],
    (messages) => {
      setMessages(messages);
      markMessagesAsRead(messages, chatId, userId);
    }
  );
};

export const markMessagesAsRead = async (
  messages: any[],
  chatId: string,
  userId: string
) => {
  messages.forEach(async (msg) => {
    if (!msg.readBy?.includes(userId) && msg.senderId !== userId) {
      await DbOps.pushToArrayInDoc(
        "chats/" + chatId + "/messages",
        msg.id,
        "readBy",
        userId
      );
    }
  });
};

export const sendMessage = async (
  chatId: string,
  userId: string,
  userName: string,
  newMessage: string
) => {
  if (!newMessage.trim()) return;
  const msgData = {
    senderId: userId,
    username: userName,
    text: newMessage,
    createdAt: DbOps.getTimestamp(),
    readBy: [userId],
  };
  await DbOps.createDoc("chats/" + chatId + "/messages", msgData);
};

export const getCallSessionId = async (
  userId: string,
  contactId: string,
  callType: "audio" | "video"
) => {
  const sessionData = {
    callerId: userId,
    calleeId: contactId,
    callType,
    status: "incoming",
    createdAt: DbOps.getTimestamp(),
  };
  const docRef = await DbOps.createDoc("callSessions", sessionData);
  return docRef.id;
};
