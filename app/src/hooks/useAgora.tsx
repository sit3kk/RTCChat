import { useRef, useState, useEffect, useCallback } from "react";
import {
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";

import { PermissionsAndroid, Platform } from "react-native";

interface AgoraConfig {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
}

// This configuration is used to connect to the Agora service for testing purposes.
const config = {
  appId: "f2f502f3c8ee422b9511b9d0c04e6821",
  channelName: "test",
  token:
    "007eJxTYGBVmr+g/fnecKfVm/ZeMMnZJ8T+YHbw5su7CpTuWDKtFSxRYEgzSjM1MEozTrZITTUxMkqyNDU0TLJMMUg2MEk1szAyfM7am94QyMhgn9bIzMgAgSA+C0NJanEJAwMAN0Qesw==",
  uid: 0,
} as AgoraConfig;

const useAgora = (callType: "audio" | "video") => {
  const { appId, channelName, token, uid } = config;
  const engineRef = useRef<IRtcEngine | null>(null);
  const eventHandlerRef = useRef<IRtcEngineEventHandler>({});
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [remoteUid, setRemoteUid] = useState<number[]>([]);
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
      onUserJoined: (_connection, uid, _elapsed) => {
        console.log("Remote user joined:", uid);
        setRemoteUid((prevUids) => [...prevUids, uid]);
      },
      onUserOffline: (_connection, uid, _reason) => {
        console.log("Remote user offline:", uid);
        setRemoteUid((prevUids) => prevUids.filter((id) => id !== uid));
      },
    };

    engineRef.current.registerEventHandler(eventHandlerRef.current);

    if (callType === "audio") {
      engineRef.current.enableAudio();
    } else {
      engineRef.current.enableVideo();
    }
  }, [appId, permissionsGranted]);

  const joinChannel = useCallback(async () => {
    if (!engineRef.current) return;
    try {
      engineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        autoSubscribeAudio: true,
      });
    } catch (error) {
      console.warn("Join channel error", error);
    }
  }, [token, channelName, uid]);

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
    await engineRef.current.leaveChannel();
    engineRef.current.unregisterEventHandler(eventHandlerRef.current!);
    engineRef.current?.release();
    engineRef.current = null;
    setIsJoined(false);
    setRemoteUid([]);
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
