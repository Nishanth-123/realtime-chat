import React, { useState, useRef, useCallback, memo } from "react";
import { useTeleparty } from "../../context/TelepartyContext";
import "./ChatInput.css";
import Button from "../common/Button/Button";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const { setUsersTypingState } = useTeleparty();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMessage = e.target.value;
      setMessage(newMessage);

      // Handle typing indicator
      if (!isTyping && newMessage.trim()) {
        setIsTyping(true);
        setUsersTypingState(true);
      }

      // Clear previous timeout
      clearTypingTimeout();

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          setUsersTypingState(false);
        }
      }, 2000);
    },
    [isTyping, clearTypingTimeout, setUsersTypingState]
  );

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");

    // Clear typing state
    setIsTyping(false);
    clearTypingTimeout();

    setUsersTypingState(false);
  }, [message, onSend, setUsersTypingState, clearTypingTimeout]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSend();
      }
    },
    [handleSend]
  );

  // Cleanup typing timeout on unmount
  React.useEffect(() => {
    return () => {
      clearTypingTimeout();
    };
  }, [clearTypingTimeout]);

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        maxLength={500}
      />
      <Button onClick={handleSend} disabled={!message.trim()}>
        Send
      </Button>
    </div>
  );
};

export default memo(ChatInput);
