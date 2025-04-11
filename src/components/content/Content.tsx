import React, { memo, useCallback, useState } from "react";
import "./Content.css";
import { UserProfile } from "../../types";
import { useTeleparty } from "../../context/TelepartyContext";
import JoinCreateRoom from "../joinCreateRoom/JoinCreateRoom";
import ChatRoom from "../chatRoom/ChatRoom";

const Content = () => {
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile>({ nickname: "" });
  const { isConnected, isConnecting, connectionClosed } = useTeleparty();

  const handleRoomJoined = useCallback(
    (newRoomId: string, profile: UserProfile) => {
      setRoomId(newRoomId);
      setUserProfile(profile);
      setInRoom(true);
    },
    []
  );
  return (
    <main className="content">
      {connectionClosed ? (
        <p>Connection closed. Reload the page...</p>
      ) : isConnected ? (
        <>
          {!inRoom ? (
            <JoinCreateRoom onRoomJoined={handleRoomJoined} />
          ) : (
            <ChatRoom roomId={roomId} userProfile={userProfile} />
          )}
        </>
      ) : isConnecting ? (
        <p>Connecting...</p>
      ) : (
        <p>Not connected</p>
      )}
    </main>
  );
};

export default memo(Content);
