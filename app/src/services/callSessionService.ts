import * as DbOps from "./dbOperations";
import { where } from "firebase/firestore";

export const fetchCallerData = async (callerId: string): Promise<any> => {
  const userDoc = await DbOps.fetchDoc("users", callerId);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      id: callerId,
      name: userData.name,
      avatar: userData.profilePic,
    };
  }
};

export const setupCallListener = (
  userId: string,
  callback: (callData: any, sessionId: string) => void
) => {
  if (!userId) return undefined;

  const constraints = [
    where("calleeId", "==", userId),
    where("status", "==", "incoming"),
  ];

  return DbOps.createSnapshotListener(
    "callSessions",
    constraints,
    async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === "added") {
          const data = change.doc.data();
          const callPartner = await fetchCallerData(data.callerId);
          callback({ ...data, callPartner }, change.doc.id);
        }
      }
    }
  );
};

export const updateCallStatus = async (
  sessionId: string,
  status: string
): Promise<void> => {
  try {
    await DbOps.updateDocById("callSessions", sessionId, { status });
  } catch (error) {
    console.error("Failed to update call status:", error);
  }
};

export const subscribeToCallSession = (
  sessionId: string,
  onUpdate: (data: any) => void
): (() => void) => {
  return DbOps.onQuerySnapshot(
    "callSessions",
    [where("docId", "==", sessionId)],
    (documents) => {
      if (documents.length > 0) {
        onUpdate(documents[0]);
      }
    }
  );
};
