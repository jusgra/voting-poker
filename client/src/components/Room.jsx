import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import HostRoom from "./HostRoom/HostRoom";
import GuestRoom from "./GuestRoom";
import { checkIfHostLeft, getStringWhoLeftToVote } from "../utils/roomUtils";
import { ToastContainer } from "react-toastify";
import styles from "./Home/Home.module.scss";

export default function Room({ socket }) {
  const roomData2 = {
    roomInfo: {
      roomId: "e3de140a-76a1-4da7-91be-e7f9b8036c08",
      hostId: "YiX454EuqZ7W8PDtAAAR",
      hostUsername: "James",
      areCardsRevealed: false,
    },
    usersInRoom: [
      {
        id: "YiX454EuqZ7W8PDtAAAR",
        username: "James",
        card: "",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Barbara",
        card: "5",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Martial",
        card: "5",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Manuel K.",
        card: "",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Dziugas",
        card: "",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Skirmantasasdasd",
        card: "?",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Ernestas",
        card: "1",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Skirmantas",
        card: "2",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "Justas",
        card: "2",
      },
      {
        id: "XRrbRU34RQqGtFDGAAAF",
        username: "SkirmantasasdasdSkirmantasasdasd",
        card: "2",
      },
    ],
  };
  const { id: roomId } = useParams();
  const navigator = useNavigate();
  const [roomData, setRoomData] = useState({ roomInfo: {}, usersInRoom: [] });
  const [isCardsRevealed, setIsCardsRevealed] = useState(false);
  const [leftToVoteString, setLeftToVoteString] = useState("");

  const isUserHost = sessionStorage.getItem("isUserHost") === "true";

  const handleLeave = (status) => {
    socket.emit("leave-room", roomId);
    navigator("/", { state: { gotDisconnected: status?.wasDisconnected } });
  };
  let storageUsername = sessionStorage.getItem("username");

  useEffect(() => {
    socket.emit("check-room", roomId);

    socket.on("check-room-response", ({ isAllowedToJoin }) => {
      if (isAllowedToJoin) {
        while (!storageUsername) {
          storageUsername = prompt("Enter Your Name:");
          sessionStorage.setItem("username", storageUsername);
        }
        socket.emit("join-room", { roomId, username: storageUsername });

        return;
      }
      navigator("/", { state: { roomNotHosted: true } });
    });

    socket.on("update-room-data", (data) => {
      setIsCardsRevealed(data?.roomInfo?.areCardsRevealed || false);
      setRoomData(data);
      setLeftToVoteString(getStringWhoLeftToVote(data));
      checkIfHostLeft(data, handleLeave);
      //DEV ENV
      // setLeftToVoteString(getStringWhoLeftToVote(roomData));
      // checkIfHostLeft(roomData, handleLeave);
    });

    return () => {
      socket.off("update-room-data");
      socket.off("check-room-response");
    };
  }, []);

  return (
    <>
      <ToastContainer className={styles.toastClass} />
      {isUserHost ? (
        <HostRoom
          socket={socket}
          roomData={roomData}
          isCardsRevealed={isCardsRevealed}
          handleLeave={handleLeave}
          leftToVoteString={leftToVoteString}
        />
      ) : (
        <GuestRoom socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} handleLeave={handleLeave} />
      )}
    </>
  );
}
