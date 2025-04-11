import React, { useCallback, memo } from "react";
import { UserProfile } from "../../types";
import { useTeleparty } from "../../context/TelepartyContext";
import "./ChatRoom.css";
import MessageList from "../messagesList/MessageList";
import ChatInput from "../chatInput/ChatInput";

interface ChatRoomProps {
  roomId: string;
  userProfile: UserProfile;
}
const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, userProfile }) => {
  const { messages, usersTyping, addMessage } = useTeleparty();

  const handleSendMessage = useCallback(
    (messageText: string) => {
      addMessage(messageText);
    },
    [addMessage]
  );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="room-info">
          <h2>Chat Room: {roomId}</h2>
          <div className="user-info">
            <p>Welcome, {userProfile.nickname}!</p>
            {userProfile.userIcon && (
              <img
                src={userProfile.userIcon}
                alt="Your icon"
                className="current-user-icon"
              />
            )}
          </div>
        </div>
        <div className="room-id-display">
          <span className="room-id-label">Share this Room ID:</span>
          <span className="room-id-value">{roomId}</span>
          <button
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              alert("Room ID copied to clipboard!");
            }}
          >
            Copy
          </button>
        </div>
      </div>

      <MessageList
        messages={messages}
        currentUserNickname={userProfile.nickname}
        usersTyping={usersTyping}
      />

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};
export default memo(ChatRoom);
