import { useEffect, useState } from "react";
import { Message } from "../types/commonTypes";
import { fetchMessagesAndListen } from "../api/FirestoreGateway";

export const useChatMessages = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = fetchMessagesAndListen(chatId, userId, setMessages);

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  return messages;
};
