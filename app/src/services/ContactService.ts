import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { Contact, Invitation } from "../types/commonTypes";
import { Timestamp } from "firebase/firestore";


export const listenToContacts = (
  userId: string,
  onContactsChange: (contacts: Contact[]) => void
) => {
  const contactsRef = collection(db, "contacts");
  const contactsQuery = query(contactsRef, where("userId", "==", userId));

  const unsubscribe = onSnapshot(contactsQuery, async (snapshot) => {
    const allContacts: Contact[] = [];
    const contactPromises = snapshot.docs.map(async (docSnap) => {
      const contactData = docSnap.data() as { contactId: string; createdAt?: any };
      const contactUserRef = doc(db, "users", contactData.contactId);
      const contactUserDoc = await getDoc(contactUserRef);

      if (contactUserDoc.exists()) {
        const userData = contactUserDoc.data() as { name: string; profilePic?: string };
        allContacts.push({
          contactId: contactData.contactId,
          userId: contactData.userId,
          createdAt: contactData.createdAt,
          name: userData.name,
          avatar: userData.profilePic || "",
        });
      }
    });

    await Promise.all(contactPromises);
    onContactsChange(allContacts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
  });

  return unsubscribe;
};

export const sendInvitation = async (
  userId: string,
  userName: string,
  invitationCode: string
) => {
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
    createdAt: Timestamp.now(),
  });

  return { success: true, message: "Invitation sent successfully." };
};

export const acceptInvitation = async (
  userId: string,
  invitationId: string,
  fromUserId: string
) => {
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
};

export const rejectInvitation = async (invitationId: string) => {
  const invitationRef = doc(db, "invitations", invitationId);
  await deleteDoc(invitationRef);
};

export const listenForInvitations = (
  userId: string,
  callback: (invitations: Invitation[]) => void
) => {
  const invitationsRef = collection(db, "invitations");
  const invitationsQuery = query(
    invitationsRef,
    where("toUserId", "==", userId),
    where("status", "==", "pending")
  );

  const unsubscribe = onSnapshot(invitationsQuery, (snapshot) => {
    const invitations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Invitation[];
    callback(invitations);
  });

  return unsubscribe;
};