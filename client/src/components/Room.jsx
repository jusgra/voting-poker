import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import HostRoom from "./HostRoom";
import GuestRoom from "./GuestRoom";

export default function Room({ socket }) {
  const { id: roomId } = useParams();
  const isUserHost = sessionStorage.getItem("isUserHost") === "true";

  const navigator = useNavigate();
  const [roomData, setRoomData] = useState({ roomInfo: {}, usersInRoom: [] });
  const [isCardsRevealed, setIsCardsRevealed] = useState(false);

  const handleLeave = () => {
    socket.emit("leave-room", roomId);
    navigator("/");
  };

  useEffect(() => {
    socket.on("update-room-data", (data) => {
      console.log(data);
      setIsCardsRevealed(data?.roomInfo?.areCardsRevealed || false);
      setRoomData(data);
    });

    // socket.on("card-reveal-toggle", () => {
    //   setIsCardsRevealed(!isCardsRevealed);
    // });

    return () => {
      socket.off("update-room-data");
      socket.off("card-reveal-toggle");
    };
  });

  return isUserHost ? (
    <HostRoom socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} handleLeave={handleLeave} />
  ) : (
    <GuestRoom socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} handleLeave={handleLeave} />
  );
}
