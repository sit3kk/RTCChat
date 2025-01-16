import {
  onSnapshot,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { CallSession } from "../types/commonTypes";

export const fetchCallerData = async (callerId: string): Promise<any> => {
  try {
    const userDoc = doc(db, "users", callerId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        id: callerId,
        name: userData.name,
        avatar: userData.profilePic,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const setupCallListener = (
  userId: string,
  callback: (callData: any, sessionId: string) => void
) => {
  if (!userId) return undefined;

  const q = query(
    collection(db, "callSessions"),
    where("calleeId", "==", userId),
    where("status", "==", "incoming")
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === "added") {
        const data = change.doc.data() as Omit<CallSession, "id">;
        const callPartner = await fetchCallerData(data.callerId);
        callback({ ...data, callPartner }, change.doc.id);
      }
    }
  });

  return unsubscribe;
};
