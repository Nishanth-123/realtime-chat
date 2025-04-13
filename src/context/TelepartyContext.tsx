import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SessionChatMessage,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";
import { getRoomDetails } from "../service/roomDetails";

interface TelepartyContextType {
  client: TelepartyClient | null;
  messages: SessionChatMessage[];
  usersTyping: string[];
  addMessage: (message: string) => void;
  joinChatRoom: (
    nickName: string,
    roomId: string,
    userIcon?: string
  ) => Promise<void>;
  createChatRoom: (nickName: string, userIcon?: string) => Promise<string>;
  setUsersTypingState: (typing: boolean) => void;
  userId: string | undefined;
  messagesLoading: boolean;
}

const TelepartyContext = createContext<TelepartyContextType | null>(null);

//ts-ignore
const TelepartyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const clientRef = useRef<TelepartyClient | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const initialRef = useRef<boolean>(true);
  const [userId, setUserId] = useState<string>();

  const onConnectionReady = useCallback(() => {
    const roomDetails = getRoomDetails();

    if (initialRef.current && roomDetails) {
      joinChatRoom(
        roomDetails.userProfile.nickname,
        roomDetails.roomId,
        roomDetails.userProfile.userIcon
      ).finally(() => {
        setMessagesLoading(false);
      });
      initialRef.current = false;
    } else {
      setMessagesLoading(false);
    }
  }, []);

  const onConnectionClosed = useCallback(() => {
    console.log("12345 connection closed");
    init();
  }, []);

  const onMessage = useCallback((message: SocketMessage) => {
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
    } else if (message.type === "userId") {
      setUserId(message.data.userId);
    }
  }, []);

  const init = useCallback(() => {
    const newClient = new TelepartyClient({
      onMessage: onMessage,
      onConnectionReady: onConnectionReady,
      onClose: onConnectionClosed,
    });
    clientRef.current = newClient;
    setClient(newClient);
  }, []);

  useEffect(() => {
    console.log("12345 new connection");
    init();

    return () => {
      console.log("12345 tear down in last use effect");
      clientRef.current?.teardown();
    };
    //@ts-nocheck
  }, []);

  const addMessage = useCallback((message: string) => {
    if (!clientRef.current) init();
    clientRef.current!!.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
      body: message,
    });
  }, []);

  const setUsersTypingState = useCallback((typing: boolean) => {
    if (!clientRef.current) init();
    clientRef.current!!.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: typing,
    });
  }, []);

  const joinChatRoom = useCallback(
    async (nickName: string, roomId: string, userIcon?: string) => {
      if (!clientRef.current) init();
      const messageList = await clientRef.current!!.joinChatRoom(
        nickName,
        roomId,
        userIcon
      );
      setMessages(messageList.messages);
    },
    []
  );

  const createChatRoom = useCallback(
    async (nickName: string, userIcon?: string) => {
      if (!clientRef.current) init();
      const roomId = await clientRef.current!!.createChatRoom(
        nickName,
        userIcon
      );
      return roomId;
    },
    []
  );

  const value = {
    client,
    messages,
    usersTyping,
    addMessage,
    joinChatRoom,
    createChatRoom,
    setUsersTypingState,
    messagesLoading,
    userId,
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
