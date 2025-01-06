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
  const callData = route.params.callData;
  const caller = callData.caller;

  const handleAccept = () => {
    console.log("Call accepted with", caller);
    navigation.navigate("ActiveAudioCall", {
      callData: callData,
    });
  };

  const handleReject = () => {
    console.log("Call rejected with", caller);
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
