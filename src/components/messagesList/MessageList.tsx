import React, { useRef, useEffect, memo, useMemo } from "react";
import "./MessageList.css";
import { SessionChatMessage } from "teleparty-websocket-lib";
import ChatMessage from "../chatMessage/ChatMessage";
import { useTeleparty } from "../../context/TelepartyContext";

interface MessageListProps {
  messages: SessionChatMessage[];
  currentUserNickname: string;
  usersTyping: string[];
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserNickname,
  usersTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId, messagesLoading } = useTeleparty();
  const otherUsersTyping = useMemo(() => {
    return usersTyping.filter((uId) => uId !== userId);
  }, [userId, usersTyping]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      {messagesLoading && <div>Loading messages...</div>}
      {messages.map((message, index) => (
        <ChatMessage
          key={`${message.permId}-${message.timestamp}-${index}`}
          message={message}
          currentUserNickname={currentUserNickname}
        />
      ))}

      {otherUsersTyping.length > 0 && (
        <div className="typing-indicator">
          {otherUsersTyping.length === 1
            ? "Someone is typing..."
            : `${otherUsersTyping.length} people are typing...`}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(MessageList);
