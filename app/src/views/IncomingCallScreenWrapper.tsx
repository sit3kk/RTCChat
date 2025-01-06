import React from "react";
import {
  useNavigation,
  RouteProp,
  CommonActions,
} from "@react-navigation/native";
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
  const callPartner = callData.callPartner;

  const handleAcceptAudio = () => {
    console.log("Call accepted with", callPartner);
    navigation.replace("AudioCall", {
      callData: callData,
    });
  };

  const handleAccept = () => {
    console.log("Call accepted with", callPartner);

    navigation.replace("VideoCall", {
      callData: callData,
    });
  };

  const handleReject = () => {
    console.log("Call rejected with", callPartner);
    navigation.goBack();
  };

  return (
    <IncomingCallScreen
      callData={callData}
      onAccept={handleAccept}
      onAcceptAudio={handleAcceptAudio}
      onReject={handleReject}
    />
  );
};

export default IncomingCallScreenWrapper;
