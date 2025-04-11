import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";

interface TelepartyContextType {
  client: TelepartyClient | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionClosed: boolean;
  messages: SessionChatMessage[];
  usersTyping: string[];
  addMessage: (message: string) => void;
  setUsersTypingState: (typing: boolean) => void;
}

const TelepartyContext = createContext<TelepartyContextType | null>(null);

//ts-ignore
const TelepartyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionClosed, setConnectionClosed] = useState(false);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const onConnectionReady = useCallback(() => {
    setIsConnected(true);
    setIsConnecting(false);
  }, []);

  const onConnectionClosed = useCallback(() => {
    setIsConnected(false);
    setConnectionClosed(true);
    setClient(null);
  }, []);

  useEffect(() => {
    console.log("12345 client", client);
  }, [client]);

  const onMessage = useCallback((message: SocketMessage) => {
    console.log("12345 message", message);
    if (message.type === SocketMessageTypes.SEND_MESSAGE.toString()) {
      const chatMessage = message.data as SessionChatMessage;
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
    } else if (
      message.type === SocketMessageTypes.SET_TYPING_PRESENCE.toString()
    ) {
      const typingData = message.data as {
        anyoneTyping: boolean;
        usersTyping: string[];
      };
      setUsersTyping(typingData.usersTyping);
    }
  }, []);

  useEffect(() => {
    const newClient = new TelepartyClient({
      onMessage: onMessage,
      onConnectionReady: onConnectionReady,
      onClose: onConnectionClosed,
    });
    setClient(newClient);

    //@ts-nocheck
  }, []);

  const addMessage = useCallback(
    (message: string) => {
      console.log("12345 addMessage", message, client);
      if (!client) return;
      client.sendMessage(
        SocketMessageTypes.SEND_MESSAGE,
        {
          body: message,
        },
        (response) => {
          console.log("12345 addMessage response", response);
        }
      );
    },
    [client]
  );

  const setUsersTypingState = useCallback(
    (typing: boolean) => {
      if (!client) return;
      client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
        typing: typing,
      });
    },
    [client]
  );

  const value = {
    client,
    isConnected,
    isConnecting,
    connectionClosed,
    messages,
    usersTyping,
    addMessage,
    setUsersTypingState,
  };

  return (
    <TelepartyContext.Provider value={value}>
      {children}
    </TelepartyContext.Provider>
  );
};

//@ts-nocheck
export default memo(TelepartyProvider);

export const useTeleparty = () => {
  const context = useContext(TelepartyContext);
  if (!context) {
    throw new Error("useTeleparty must be used within a TelepartyProvider");
  }
  return context as TelepartyContextType;
};
