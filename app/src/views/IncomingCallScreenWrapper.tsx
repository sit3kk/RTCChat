import React from "react";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { InteractionStackParamList } from "../../App";
import IncomingCallScreen from "./IncomingCallScreen";

interface IncomingCallScreenWrapperProps {
  route: RouteProp<InteractionStackParamList, "IncomingCall">;
}

const IncomingCallScreenWrapper: React.FC<IncomingCallScreenWrapperProps> = ({
  route,
}) => {
  const navigation =
    useNavigation<StackNavigationProp<InteractionStackParamList>>();
  const { caller, callType } = route.params;

  const handleAccept = () => {
    console.log("Call accepted with", caller);
  };

  const handleReject = () => {
    console.log("Call rejected with", caller);
    navigation.goBack();
  };

  return (
    <IncomingCallScreen
      caller={caller}
      callType={callType}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};

export default IncomingCallScreenWrapper;
