export interface UserData {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
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

export interface CallData {
  caller: Contact;
  callType: "audio" | "video";
}
