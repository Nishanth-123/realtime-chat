import { memo, useCallback, useEffect, useState } from "react";
import "./Content.css";
import { UserProfile } from "../../types";
import { useTeleparty } from "../../context/TelepartyContext";
import JoinCreateRoom from "../joinCreateRoom/JoinCreateRoom";
import ChatRoom from "../chatRoom/ChatRoom";
import { getRoomDetails, saveRoomDetails } from "../../service/roomDetails";

const Content = () => {
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile>({ nickname: "" });
  const { client } = useTeleparty();

  useEffect(() => {
    const roomDetails = getRoomDetails();
    if (roomDetails) {
      setRoomId(roomDetails.roomId);
      setUserProfile(roomDetails.userProfile);
      setInRoom(true);
    }
  }, []);

  const handleRoomJoined = useCallback(
    (newRoomId: string, profile: UserProfile) => {
      setRoomId(newRoomId);
      setUserProfile(profile);
      setInRoom(true);

      saveRoomDetails({ roomId: newRoomId, userProfile: profile });
    },
    []
  );

  const handleSignOut = useCallback(() => {
    setInRoom(false);
    setRoomId("");
    setUserProfile({ nickname: "" });
    saveRoomDetails(undefined);
    client?.teardown();
  }, [client]);

  return (
    <main className="content">
      {!inRoom ? (
        <JoinCreateRoom onRoomJoined={handleRoomJoined} />
      ) : (
        <ChatRoom
          roomId={roomId}
          userProfile={userProfile}
          onSignOut={handleSignOut}
        />
      )}
    </main>
  );
};

export default memo(Content);
