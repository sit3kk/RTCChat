import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/FirebaseConfig";
import { useUserData } from "./UserDataProvider";
import { AuthenticatedStackProp } from "../../App";

type CallStatus = "incoming" | "accepted" | "rejected" | "ended";

interface CallSession {
  id: string;
  callerId: string;
  calleeId: string;
  callType: "audio" | "video";
  status: CallStatus;
  createdAt: any;
}

const CallSessionContext = createContext({});

export const useCallSessionContext = () => useContext(CallSessionContext);

export const CallSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const { userId } = useUserData();

  const navigation = useNavigation<AuthenticatedStackProp>();
  const fetchCallerData = async (callerId: string) => {
    try {
      const userDoc = doc(db, "users", callerId);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        console.log(JSON.stringify(userData));
        return {
          id: callerId,
          name: userData.name,
          avatar: userData.profilePic,
        };
      }
    } catch (error) {
      console.error("Error fetching caller data:", error);
    }

    return {
      id: callerId,
      name: "undefined",
      avatar: "https://example.com/default-avatar.png",
    };
  };

  useEffect(() => {
    if (!userId) return;

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

          navigation.navigate("InteractionStack", {
            screen: "IncomingCall",
            params: {
              callData: {
                callPartner,
                callType: data.callType,
                callSessionId: change.doc.id,
              },
            },
          });
        }
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <CallSessionContext.Provider value={{ activeCall, setActiveCall }}>
      {children}
    </CallSessionContext.Provider>
  );
};
