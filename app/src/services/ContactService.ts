import * as DbOps from "./dbOperations";
import { where } from "firebase/firestore";
import { Contact, Invitation } from "../types/commonTypes";

export const listenToContacts = (
  userId: string,
  onContactsChange: (contacts: Contact[]) => void
) => {
  return DbOps.createSnapshotListener(
    "contacts",
    [where("userId", "==", userId)],
    (snapshot) => {
      const allContacts: Contact[] = [];
      const contactPromises = snapshot.docs.map(async (docSnap: any) => {
        const contactData = docSnap.data();
        const contactUserDoc = await DbOps.fetchDoc(
          "users",
          contactData.contactId
        );
        if (contactUserDoc.exists()) {
          const userData = contactUserDoc.data();
          allContacts.push({
            contactId: contactData.contactId,
            userId: contactData.userId,
            createdAt: contactData.createdAt,
            name: userData.name,
            avatar: userData.profilePic || "",
          });
        }
      });
      Promise.all(contactPromises).then(() => {
        onContactsChange(
          allContacts.sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          )
        );
      });
    }
  );
};

export const sendInvitation = async (
  userId: string,
  userName: string,
  invitationCode: string
) => {
  const constraints = [where("invitationCode", "==", invitationCode)];
  const userSnapshot = await DbOps.executeQuery("users", constraints);
  if (userSnapshot.empty) {
    return { success: false, message: "No user found with this code." };
  }
  const toUserId = userSnapshot.docs[0].id;
  const toUserName = userSnapshot.docs[0].data().name;
  await DbOps.createDoc("invitations", {
    fromUserId: userId,
    fromUserName: userName,
    toUserId,
    toUserName,
    status: "pending",
    createdAt: DbOps.getTimestamp(),
  });
  return { success: true, message: "Invitation sent successfully." };
};

export const acceptInvitation = async (
  userId: string,
  invitationId: string,
  fromUserId: string
) => {
  await DbOps.updateDocById("invitations", invitationId, {
    status: "accepted",
  });
  await DbOps.createDoc("contacts", {
    userId,
    contactId: fromUserId,
    createdAt: DbOps.getTimestamp(),
  });
  await DbOps.createDoc("contacts", {
    userId: fromUserId,
    contactId: userId,
    createdAt: DbOps.getTimestamp(),
  });
};

export const rejectInvitation = async (invitationId: string) => {
  await DbOps.deleteDocById("invitations", invitationId);
};

export const listenForInvitations = (
  userId: string,
  callback: (invitations: Invitation[]) => void
) => {
  const constraints = [
    where("toUserId", "==", userId),
    where("status", "==", "pending"),
  ];
  return DbOps.onQuerySnapshot("invitations", constraints, (documents) => {
    callback(documents);
  });
};
