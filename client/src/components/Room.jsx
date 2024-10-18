import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import HostRoom from "./HostRoom/HostRoom";
import GuestRoom from "./GuestRoom";
import { checkIfHostLeft } from "../utils/roomUtils";
import {ToastContainer} from "react-toastify";
import styles from "./Home/Home.module.scss";

export default function Room({ socket }) {
  const { id: roomId } = useParams();
  const isUserHost = sessionStorage.getItem("isUserHost") === "true";

  const navigator = useNavigate();
  const [roomData, setRoomData] = useState({ roomInfo: {}, usersInRoom: [] });
  const [isCardsRevealed, setIsCardsRevealed] = useState(false);

  const handleLeave = ({ wasDisconnected }) => {
    socket.emit("leave-room", roomId);
    navigator("/", { state: { disconnected: wasDisconnected } });
  };

  useEffect(() => {
    socket.on("update-room-data", (data) => {
      setIsCardsRevealed(data?.roomInfo?.areCardsRevealed || false);
      setRoomData(data);
      checkIfHostLeft(data, handleLeave);
    });

    // socket.on("card-reveal-toggle", () => {
    //   setIsCardsRevealed(!isCardsRevealed);
    // });

    return () => {
      socket.off("update-room-data");
      socket.off("card-reveal-toggle");
    };
  });

  return <>
    <ToastContainer className={styles.toastClass}/>
    {isUserHost ? (
        <HostRoom socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} handleLeave={handleLeave} />
    ) : (
        <GuestRoom socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} handleLeave={handleLeave} />
    )}
  </>
}
