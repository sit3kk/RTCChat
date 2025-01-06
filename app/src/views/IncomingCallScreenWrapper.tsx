import React from "react";
import { RouteProp } from "@react-navigation/native";
import { InteractionStackParamList } from "../../App";
import IncomingCallScreen from "./IncomingCallScreen";

interface IncomingCallScreenWrapperProps {
  route: RouteProp<InteractionStackParamList, "IncomingCall">;
}

const IncomingCallScreenWrapper: React.FC<IncomingCallScreenWrapperProps> = ({
  route,
}) => {
  const { caller } = route.params;

  const handleAccept = () => {
    console.log("Call accepted with", caller);
  };

  const handleReject = () => {
    console.log("Call rejected with", caller);
  };

  return (
    <IncomingCallScreen
      caller={caller}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};

export default IncomingCallScreenWrapper;
