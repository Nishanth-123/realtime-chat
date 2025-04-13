// src/components/JoinCreateRoom/JoinCreateRoom.tsx
import React, { useState, memo, useCallback } from "react";
import { UserProfile } from "../../types";
import { useTeleparty } from "../../context/TelepartyContext";
import UserIconUpload from "../common/userIconUpload/UserIconUpload";
import "./JoinCreateRoom.css";
import Button from "../common/Button/Button";

interface JoinCreateRoomProps {
  onRoomJoined: (roomId: string, profile: UserProfile) => void;
}

const JoinCreateRoom = ({ onRoomJoined }: JoinCreateRoomProps) => {
  const { client, joinChatRoom, createChatRoom } = useTeleparty();
  const [nickname, setNickname] = useState("");
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleNicknameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNickname(e.target.value);
    },
    []
  );

  const handleJoinRoomIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setJoinRoomId(e.target.value);
    },
    []
  );

  const handleIconChange = useCallback((icon: string | undefined) => {
    setUserIcon(icon);
  }, []);

  const createRoom = useCallback(async () => {
    if (!client || !nickname.trim()) return;

    try {
      setIsCreating(true);
      const newRoomId = await createChatRoom(nickname, userIcon);
      onRoomJoined(newRoomId, { nickname, userIcon });
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }, [createChatRoom, nickname, userIcon, onRoomJoined]);

  const joinRoom = useCallback(async () => {
    if (!client || !joinRoomId.trim() || !nickname.trim()) return;

    try {
      setIsJoining(true);
      await joinChatRoom(nickname, joinRoomId, userIcon);
      onRoomJoined(joinRoomId, { nickname, userIcon });
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please check the room ID and try again.");
    } finally {
      setIsJoining(false);
    }
  }, [joinChatRoom, joinRoomId, nickname, userIcon, onRoomJoined]);

  return (
    <div className="join-create-container">
      <div className="nickname-container">
        <label htmlFor="nickname">Your Nickname:</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="Enter your nickname"
          maxLength={30}
        />
      </div>

      <UserIconUpload userIcon={userIcon} onIconChange={handleIconChange} />

      <div className="room-actions">
        <div className="create-room">
          <h3>Create a New Room</h3>
          <Button
            onClick={createRoom}
            disabled={!nickname.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </div>

        <div className="join-room">
          <h3>Join Existing Room</h3>
          <input
            type="text"
            value={joinRoomId}
            onChange={handleJoinRoomIdChange}
            placeholder="Enter Room ID"
          />
          <Button
            onClick={joinRoom}
            disabled={!joinRoomId.trim() || !nickname.trim() || isJoining}
          >
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(JoinCreateRoom);
