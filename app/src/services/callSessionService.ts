import {
  onSnapshot,
  collection,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
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

export const updateCallStatus = async (
  sessionId: string,
  status: string
): Promise<void> => {
  const sessionDocRef = doc(db, "callSessions", sessionId);
  try {
    await updateDoc(sessionDocRef, { status });
  } catch (error) {
    console.error("Failed to update call status:", error);
  }
};

export const subscribeToCallSession = (
  sessionId: string,
  onUpdate: (data: any) => void,
  onError: (error: FirestoreError) => void
): (() => void) => {
  const sessionDocRef = doc(db, "callSessions", sessionId);

  const unsubscribe = onSnapshot(
    sessionDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data());
      }
    },
    (error) => {
      onError(error);
    }
  );
  return unsubscribe;
};
