import { db } from "./FirebaseConfig";
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
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { Contact, Invitation, ChatItem, Message } from "../types/commonTypes";
import { Timestamp } from "firebase/firestore";

export const fetchContacts = async (userId: string): Promise<Contact[]> => {
  try {
    const contactsQuery = query(
      collection(db, "contacts"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(contactsQuery);

    const fetchedContacts = [];
    for (const contactDoc of querySnapshot.docs) {
      const contactData = contactDoc.data();
      const contactUserId = contactData.contactId;

      const contactUserRef = doc(db, "users", contactUserId);
      const contactUserDoc = await getDoc(contactUserRef);

      if (contactUserDoc.exists()) {
        const userData = contactUserDoc.data() as {
          name: string;
          profilePic: string;
        };

        fetchedContacts.push({
          contactId: contactUserId,
          userId: contactData.userId,
          createdAt: contactData.createdAt,
          name: userData.name,
          avatar: userData.profilePic,
        });
      }
    }
    return fetchedContacts;
  } catch (error) {
    throw error;
  }
};

export const fetchInvitations = async (
  userId: string
): Promise<Invitation[]> => {
  try {
    const invitationsQuery = query(
      collection(db, "invitations"),
      where("toUserId", "==", userId),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(invitationsQuery);

    const fetchedInvitations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Invitation[];
    return fetchedInvitations;
  } catch (error) {
    throw error;
  }
};

export const sendInvitation = async (
  userId: string,
  userName: string,
  invitationCode: string
) => {
  try {
    const userQuery = query(
      collection(db, "users"),
      where("invitationCode", "==", invitationCode)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return { success: false, message: "No user found with this code." };
    }

    const toUserId = userSnapshot.docs[0].id;
    const toUserName = userSnapshot.docs[0].data().name;

    await addDoc(collection(db, "invitations"), {
      fromUserId: userId,
      fromUserName: userName,
      toUserId,
      toUserName,
      status: "pending",
    });

    return { success: true, message: "Invitation sent successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: "Error sending invitation: " + error.message,
    };
  }
};

export const acceptInvitation = async (
  userId: string,
  invitationId: string,
  fromUserId: string
) => {
  try {
    const invitationRef = doc(db, "invitations", invitationId);
    await updateDoc(invitationRef, { status: "accepted" });

    const createdAt = Timestamp.now();
    await addDoc(collection(db, "contacts"), {
      userId,
      contactId: fromUserId,
      createdAt,
    });
    await addDoc(collection(db, "contacts"), {
      userId: fromUserId,
      contactId: userId,
      createdAt,
    });
  } catch (error) {
    throw error;
  }
};

export const rejectInvitation = async (invitationId: string) => {
  try {
    const invitationRef = doc(db, "invitations", invitationId);
    await deleteDoc(invitationRef);
  } catch (error) {
    throw error;
  }
};

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
    const avatar = contactUserSnapshot.exists()
      ? (contactUserSnapshot.data() as { profilePic?: string }).profilePic || ""
      : "";

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
            avatar,
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
