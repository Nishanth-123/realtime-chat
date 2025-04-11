import React, { memo } from "react";
import "./ChatMessage.css";
import { SessionChatMessage } from "teleparty-websocket-lib";

interface ChatMessageProps {
  message: SessionChatMessage;
  currentUserNickname: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentUserNickname,
}) => {
  const isCurrentUser =
    !message.isSystemMessage && message.userNickname === currentUserNickname;

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.isSystemMessage) {
    return (
      <div className="message system-message">
        <div className="message-body">{message.body}</div>
      </div>
    );
  }

  return (
    <div
      className={`message ${isCurrentUser ? "user-message" : "other-message"}`}
    >
      <div className="message-header">
        {message.userIcon && (
          <img
            src={message.userIcon}
            alt={`${message.userNickname}'s icon`}
            className="user-icon"
          />
        )}
        <span className="username">{message.userNickname}</span>
        <span className="timestamp">{formatTime(message.timestamp)}</span>
      </div>
      <div className="message-body">{message.body}</div>
    </div>
  );
};

export default memo(ChatMessage);
