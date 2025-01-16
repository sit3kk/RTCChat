import { db } from "./firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const checkInvitationStatus = async (
  fromUserId: string,
  toInvitationCode: string
): Promise<string> => {
  const invitationsQuery = query(
    collection(db, "invitations"),
    where("fromUserId", "==", fromUserId),
    where("status", "==", "pending")
  );

  const querySnapshot = await getDocs(invitationsQuery);

  const invitationExists = querySnapshot.docs.some((doc) => {
    const invitation = doc.data();
    return invitation.toUserId === toInvitationCode;
  });

  if (invitationExists) {
    return "pending";
  }

  return "not_pending";
};

export const sendInvitation = async (
  fromUserId: string,
  toInvitationCode: string
): Promise<void> => {
  const toUserSnapshot = await getDocs(
    query(
      collection(db, "users"),
      where("invitationCode", "==", toInvitationCode)
    )
  );

  if (!toUserSnapshot.empty) {
    const toUserId = toUserSnapshot.docs[0].id;

    await addDoc(collection(db, "invitations"), {
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: "pending",
    });

    console.log("Invitation sent successfully!");
  } else {
    throw new Error("User with the provided invitation code was not found.");
  }
};
