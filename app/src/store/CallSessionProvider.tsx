import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUserData } from "./UserDataProvider";
import { CallData, CallSession } from "../types/commonTypes";
import { setupCallListener } from "../services/callSessionService";
import { AuthenticatedStackProp } from "../../App";

interface CallSessionProps {
  activeCall: CallSession | null;
  setActiveCall: (call: CallSession | null) => void;
}

const CallSessionContext = createContext<CallSessionProps | undefined>(
  undefined
);

export function CallSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const { userId } = useUserData();
  const navigation = useNavigation<AuthenticatedStackProp>();

  useEffect(() => {
    const unsubscribe = setupCallListener(userId, (callData, sessionId) => {
      navigation.navigate("InteractionStack", {
        screen: "IncomingCall",
        params: {
          callData: { ...callData, callSessionId: sessionId },
        },
      });
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [userId, navigation]);

  const value = {
    activeCall: activeCall,
    setActiveCall: setActiveCall,
  };

  return (
    <CallSessionContext.Provider value={value}>
      {children}
    </CallSessionContext.Provider>
  );
}

export function useCallSession() {
  const context = useContext(CallSessionContext);
  if (!context) {
    throw new Error("useCallSession must be used within a CallSessionProvider");
  }
  return context;
}
