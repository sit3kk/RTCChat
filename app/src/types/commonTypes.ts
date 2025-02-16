import { Timestamp } from "firebase/firestore";

export interface UserData {
  id: string;
  name: string;
  email: string;
  picture: string;
  invitationCode: string;
}

export interface Contact {
  contactId: string;
  userId: string;
  name: string;
  avatar: string;
  createdAt: Timestamp;
}

export interface ContactSectionsType {
  title: string;
  index: number;
  key: string;
  data: Contact[];
}

export interface Invitation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: string;
}

export interface ChatItem {
  contactId: string;
  contactName: string;
  contactAvatar: string;
  lastMessageText?: string;
  lastMessageDate?: number;
  unreadCount?: number;
  createdAt?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  readBy?: string[];
}

export interface CallData {
  callPartner: Contact;
  callType: "audio" | "video";
  callSessionId: string;
}

export type CallStatus = "incoming" | "accepted" | "rejected" | "ended";

export interface CallSession {
  id: string;
  callerId: string;
  calleeId: string;
  callType: "audio" | "video";
  status: CallStatus;
  createdAt: any;
}
