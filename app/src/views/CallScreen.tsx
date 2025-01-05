import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from "react-native-webrtc";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../api/FirebaseConfig";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const CALL_DOC_ID = "myCall";

const CallScreen = () => {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [callJoined, setCallJoined] = useState(false);

  // Poprawny typ dla peerConnection
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      requestPermissions();
    }
    initPeerConnection();
    return () => {
      endCall();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    } catch (err) {
      console.warn(err);
    }
  };

  const initPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection(configuration);

    // Poprawne przypisanie do onicecandidate
    peerConnection.current.onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log("ICE Candidate sent:", event.candidate);

        const candidateData = event.candidate.toJSON();
        if (callStarted) {
          addDoc(
            collection(db, "calls", CALL_DOC_ID, "callerCandidates"),
            candidateData
          );
        } else if (callJoined) {
          addDoc(
            collection(db, "calls", CALL_DOC_ID, "calleeCandidates"),
            candidateData
          );
        }
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });
  };

  const startCall = async () => {
    if (!peerConnection.current) return;
    setCallStarted(true);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    const callDoc = doc(db, "calls", CALL_DOC_ID);
    await setDoc(callDoc, { offer: JSON.stringify(offer) });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && peerConnection.current?.remoteDescription == null) {
        const answerDescription = new RTCSessionDescription(
          JSON.parse(data.answer)
        );
        peerConnection.current.setRemoteDescription(answerDescription);
      }
    });
  };

  const joinCall = async () => {
    if (!peerConnection.current) return;
    setCallJoined(true);

    const callDoc = doc(db, "calls", CALL_DOC_ID);
    const callSnapshot = await getDoc(callDoc);
    const callData = callSnapshot.data();

    if (!callData?.offer) return;

    const offerDescription = new RTCSessionDescription(
      JSON.parse(callData.offer)
    );
    await peerConnection.current.setRemoteDescription(offerDescription);

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    await updateDoc(callDoc, { answer: JSON.stringify(answer) });
  };

  const endCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setCallStarted(false);
    setCallJoined(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WebRTC with Firestore</Text>
      <View style={styles.videoContainer}>
        {localStream && (
          <RTCView streamURL={localStream.toURL()} style={styles.video} />
        )}
        {remoteStream && (
          <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        {!callStarted && !callJoined && (
          <>
            <Button title="Start Call" onPress={startCall} />
            <Button title="Join Call" onPress={joinCall} />
          </>
        )}
        {(callStarted || callJoined) && (
          <Button title="End Call" onPress={endCall} color="red" />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  videoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  video: {
    width: 150,
    height: 220,
    backgroundColor: "#000",
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
