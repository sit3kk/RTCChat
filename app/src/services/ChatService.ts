import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ChatItem, Message } from "../types/commonTypes";
import { Timestamp } from "firebase/firestore";
import { randomAvatar } from "../utils/utils";

export const fetchChats = async (userId: string): Promise<ChatItem[]> => {
  const contactsRef = collection(db, "contacts");
  const q = query(contactsRef, where("userId", "==", userId));
  const contactsSnapshot = await getDocs(q);

  const allChats: ChatItem[] = [];
  const chatPromises = contactsSnapshot.docs.map(async (docSnap) => {
    const contactData = docSnap.data() as {
      contactId: string;
      createdAt?: any;
    };
    const contactUserRef = doc(db, "users", contactData.contactId);
    const contactUserSnapshot = await getDoc(contactUserRef);

    const contactName = contactUserSnapshot.exists()
      ? (contactUserSnapshot.data() as { name: string }).name
      : "Unknown";

    const defaultAvatar = randomAvatar(); // TODO set a default avatar
    const contactAvatar = contactUserSnapshot.exists()
      ? (contactUserSnapshot.data() as { profilePic?: string }).profilePic ||
        defaultAvatar
      : defaultAvatar;

    const chatId = [userId, contactData.contactId].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");
    const msgQuery = query(messagesRef, orderBy("createdAt", "desc"));

    await new Promise<void>((resolve) =>
      onSnapshot(msgQuery, (snapshot) => {
        if (!snapshot.empty) {
          const lastMsgDoc = snapshot.docs[0];
          const lastMsgData = lastMsgDoc.data() as {
            text: string;
            createdAt: { seconds: number };
            readBy?: string[];
            senderId: string;
          };

          const unreadCount = snapshot.docs.filter(
            (m) =>
              !m.data().readBy?.includes(userId) && m.data().senderId !== userId
          ).length;

          allChats.push({
            contactId: contactData.contactId,
            contactName,
            contactAvatar,
            lastMessageText: lastMsgData.text,
            lastMessageDate: lastMsgData.createdAt.seconds * 1000,
            unreadCount,
            createdAt: contactData.createdAt?.seconds * 1000 || 0,
          });
        }
        resolve();
      })
    );
  });

  await Promise.all(chatPromises);
  return allChats.sort(
    (a, b) =>
      (b.lastMessageDate || 0) - (a.lastMessageDate || 0) ||
      (b.createdAt || 0) - (a.createdAt || 0)
  );
};

export const fetchMessagesAndListen = (
  chatId: string,
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
    setMessages(messages);
    markMessagesAsRead(snapshot.docs, chatId, userId);
  });
  return unsubscribe;
};

export const markMessagesAsRead = async (
  docs: any[],
  chatId: string,
  userId: string
) => {
  docs.forEach(async (docSnap) => {
    const msgData = docSnap.data() as Message;
    if (!msgData.readBy?.includes(userId) && msgData.senderId !== userId) {
      try {
        await updateDoc(doc(db, "chats", chatId, "messages", docSnap.id), {
          readBy: arrayUnion(userId),
        });
      } catch (error) {
        throw error;
      }
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
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: userId,
      username: userName,
      text: newMessage,
      createdAt: Timestamp.now(),
      readBy: [userId],
    });
  } catch (error) {
    throw error;
  }
};

export const getCallSessionId = async (
  userId: string,
  contactId: string,
  callType: "audio" | "video"
) => {
  try {
    const docRef = await addDoc(collection(db, "callSessions"), {
      callerId: userId,
      calleeId: contactId,
      callType,
      status: "incoming",
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
