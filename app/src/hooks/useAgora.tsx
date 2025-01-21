import { useRef, useState, useEffect, useCallback } from "react";
import {
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";

import { PermissionsAndroid, Platform } from "react-native";
import { AGORA_APP_ID, AGORA_CHANNEL_NAME, AGORA_TOKEN, AGORA_UID } from "@env";

interface AgoraConfig {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
}

// This configuration is used to connect to the Agora service for testing purposes.
const config: AgoraConfig = {
  appId: AGORA_APP_ID,
  channelName: AGORA_CHANNEL_NAME,
  token: AGORA_TOKEN,
  uid: parseInt(AGORA_UID, 10),
};
const useAgora = (callType: "audio" | "video") => {
  const { appId, channelName, token, uid } = config;
  const engineRef = useRef<IRtcEngine | null>(null);
  const eventHandlerRef = useRef<IRtcEngineEventHandler>({});
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [remoteUid, setRemoteUid] = useState<number>(0);
  // const [remoteUid, setRemoteUid] = useState<number[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        setPermissionsGranted(
          granted["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            granted["android.permission.CAMERA"] ===
              PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        setPermissionsGranted(true);
      }
    };

    requestPermissions();
  }, []);

  const init = useCallback(async () => {
    if (!permissionsGranted || engineRef.current) return;

    engineRef.current = createAgoraRtcEngine();
    engineRef.current.initialize({
      appId: appId,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    eventHandlerRef.current = {
      onJoinChannelSuccess: (_connection, _elapsed) => {
        setIsJoined(true);
        console.log("Join channel success");
      },
      onUserJoined: (_connection, remoteUid, _elapsed) => {
        console.log("Remote user joined:", remoteUid);
        // setRemoteUid((prevUids) => [...prevUids, uid]);
        setRemoteUid(remoteUid);
      },
      onUserOffline: (_connection, uid, _reason) => {
        console.log("Remote user offline:", uid);
        // setRemoteUid((prevUids) => prevUids.filter((id) => id !== uid));
        setRemoteUid(0);
      },
    };

    engineRef.current.registerEventHandler(eventHandlerRef.current);

    if (callType === "audio") {
      engineRef.current.enableAudio();
    } else {
      engineRef.current.enableVideo();
      engineRef.current.startPreview();
    }
  }, [appId, permissionsGranted]);

  const joinChannel = useCallback(async () => {
    if (!engineRef.current) return;

    const joinChannelVideoOptions = {
      autoSubscribeVideo: true,
      publishCameraTrack: true,
    };

    try {
      engineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: true,
        publishMicrophoneTrack: true,
        ...(callType === "video" ? joinChannelVideoOptions : {}),
      });
    } catch (error) {
      console.warn("Join channel error", error);
    }
  }, [callType, token, channelName, uid]);

  const leaveChannel = async () => {
    if (!engineRef.current) return;
    engineRef.current.leaveChannel();
    setIsJoined(false);
  };

  const toggleMute = async (mute: boolean) => {
    engineRef.current?.muteLocalAudioStream(mute);
  };

  const setSpeakerphoneOn = async (on: boolean) => {
    engineRef.current?.setEnableSpeakerphone(on);
  };

  const toggleCamera = useCallback(async (enable: boolean) => {
    engineRef.current?.muteLocalVideoStream(!enable);
  }, []);

  const switchCamera = useCallback(async () => {
    engineRef.current?.switchCamera();
  }, []);

  const destroy = useCallback(async () => {
    if (!engineRef.current) return;
    engineRef.current.leaveChannel();
    engineRef.current.unregisterEventHandler(eventHandlerRef.current!);
    engineRef.current?.release();
    engineRef.current = null;
    setIsJoined(false);
    // setRemoteUid(0);
  }, []);

  useEffect(() => {
    init().then(() => {
      joinChannel();
    });

    return () => {
      destroy();
    };
  }, [init, destroy]);

  return {
    isJoined,
    remoteUid,
    toggleMute,
    setSpeakerphoneOn,
    toggleCamera,
    switchCamera,
    leaveChannel,
  };
};

export default useAgora;
