import React, { useRef, useEffect, memo } from "react";
import "./MessageList.css";
import { SessionChatMessage } from "teleparty-websocket-lib";
import ChatMessage from "../chatMessage/ChatMessage";

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

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <ChatMessage
          key={`${message.permId}-${message.timestamp}-${index}`}
          message={message}
          currentUserNickname={currentUserNickname}
        />
      ))}

      {usersTyping.length > 0 && (
        <div className="typing-indicator">
          {usersTyping.length === 1
            ? "Someone is typing..."
            : `${usersTyping.length} people are typing...`}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(MessageList);
