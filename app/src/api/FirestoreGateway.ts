import { db } from "./FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Contact, Invitation } from "../types/commonTypes";
import { randomAvatar } from "../utils/utils";
import { Timestamp } from "firebase/firestore";

export const fetchContacts = async (userId: string): Promise<any[]> => {
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
    console.error("Failed to fetch contacts:", error);
    throw error;
  }
};

export const fetchInvitations = async (userId: string) => {
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
    console.error("Failed to fetch invitations:", error);
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
    console.error("Error sending invitation:", error);
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
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

export const rejectInvitation = async (invitationId: string) => {
  try {
    const invitationRef = doc(db, "invitations", invitationId);
    await deleteDoc(invitationRef);
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    throw error;
  }
};
