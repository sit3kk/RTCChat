import React from "react";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { InteractionStackParamList } from "../../App";
import IncomingCallScreen from "./IncomingCallScreen";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../api/FirebaseConfig";

interface IncomingCallScreenWrapperProps {
  route: RouteProp<InteractionStackParamList, "IncomingCall">;
}

const IncomingCallScreenWrapper: React.FC<IncomingCallScreenWrapperProps> = ({
  route,
}) => {
  const navigation =
    useNavigation<StackNavigationProp<InteractionStackParamList>>();
  const { callData } = route.params;
  const { callPartner, callType, callSessionId } = callData;

  const handleAcceptAudio = async () => {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "accepted",
    });
    navigation.replace("AudioCall", {
      callData: {
        ...callData,
        callType: "audio",
      },
    });
  };

  const handleAcceptVideo = async () => {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "accepted",
    });
    navigation.replace("VideoCall", {
      callData: {
        ...callData,
        callType: "video",
      },
    });
  };

  const handleReject = async () => {
    await updateDoc(doc(db, "callSessions", callSessionId), {
      status: "rejected",
    });
    navigation.goBack();
  };

  return (
    <IncomingCallScreen
      callData={callData}
      onAccept={handleAcceptVideo}
      onAcceptAudio={handleAcceptAudio}
      onReject={handleReject}
    />
  );
};

export default IncomingCallScreenWrapper;
