import React from "react";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { InteractionStackParamList } from "../../App";
import IncomingCallScreen from "./IncomingCallScreen";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

interface IncomingCallScreenWrapperProps {
  route: RouteProp<InteractionStackParamList, "IncomingCall">;
}

const IncomingCallScreenWrapper: React.FC<IncomingCallScreenWrapperProps> = ({
  route,
}) => {
  const navigation =
    useNavigation<StackNavigationProp<InteractionStackParamList>>();
  const { callData } = route.params;
  const { callType, callSessionId } = callData;

  const handleAccept = async () => {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "accepted",
    });
    navigation.replace(callType === "audio" ? "AudioCall" : "VideoCall", {
      callData: callData,
    });
  };

  const handleReject = async () => {
    console.log("FRYTKI handleReject", callData);
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "rejected",
    });
    navigation.goBack();
  };

  return (
    <IncomingCallScreen
      callData={callData}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};

export default IncomingCallScreenWrapper;
