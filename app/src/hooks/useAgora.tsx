import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  ChannelProfileType,
  ClientRoleType,
  RtcConnection,
} from "react-native-agora";

import { AGORA_TOKEN, AGORA_APP_ID } from "@env";

interface UseAgoraProps {
  channelName: string;
  isVideoCall?: boolean;
}

export function useAgora({ channelName, isVideoCall = false }: UseAgoraProps) {
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const eventHandlerRef = useRef<IRtcEngineEventHandler>({});

  const [remoteUid, setRemoteUid] = useState<number>(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(isVideoCall);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        await requestAndroidPermissions();
      }
      initAgora();
      joinChannel();
    })();

    return () => {
      leaveChannel();
      agoraEngineRef.current?.unregisterEventHandler(eventHandlerRef.current!);
      agoraEngineRef.current?.release();
      agoraEngineRef.current = null;
    };
  }, []);

  async function requestAndroidPermissions() {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }

  function initAgora() {
    const engine = createAgoraRtcEngine();
    agoraEngineRef.current = engine;

    eventHandlerRef.current = {
      onJoinChannelSuccess: (_connection, _elapsed) => {
        console.log("Join channel success");
      },
      onUserJoined: (_connection: RtcConnection, remoteUid: number) => {
        console.log("Remote user joined:", remoteUid);
        setRemoteUid(remoteUid);
      },
      onUserOffline: (_connection, remoteUid) => {
        console.log("Remote user offline:", remoteUid);
        setRemoteUid(0);
      },
    };
    engine.registerEventHandler(eventHandlerRef.current);

    engine.initialize({
      appId: AGORA_APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    if (isVideoCall) {
      engine.enableVideo();
      engine.startPreview();
    } else {
      engine.enableAudio();
    }

    engine.enableAudio();
  }

  function joinChannel() {
    agoraEngineRef.current?.joinChannel(AGORA_TOKEN, channelName, 0, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      autoSubscribeAudio: true,
      autoSubscribeVideo: isVideoCall,
      publishCameraTrack: isVideoCall,
      publishMicrophoneTrack: true,
    });
  }

  function leaveChannel() {
    agoraEngineRef.current?.leaveChannel();
  }

  function toggleMute() {
    const newMute = !muted;
    setMuted(newMute);
    agoraEngineRef.current?.muteLocalAudioStream(newMute);
  }

  function toggleSpeaker() {
    const newSpeaker = !speakerOn;
    setSpeakerOn(newSpeaker);
    agoraEngineRef.current?.setEnableSpeakerphone(newSpeaker);
  }

  function toggleCamera() {
    if (isVideoCall) {
      const newCameraOn = !cameraOn;
      setCameraOn(newCameraOn);
      agoraEngineRef.current?.muteLocalVideoStream(!newCameraOn);
    }
  }

  function switchCamera() {
    if (isVideoCall) {
      agoraEngineRef.current?.switchCamera();
    }
  }

  return {
    remoteUid,
    isCallActive,
    setIsCallActive,
    callDuration,
    muted,
    speakerOn,
    cameraOn,
    toggleMute,
    toggleSpeaker,
    toggleCamera,
    switchCamera,
    leaveChannel,
  };
}
