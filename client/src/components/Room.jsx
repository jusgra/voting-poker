import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React from "react";
import HostRoom from "./HostRoom/HostRoom";
import GuestRoom from "./GuestRoom";
import { checkIfHostLeft, getSortedResults, getStringWhoLeftToVote } from "../utils/roomUtils";
import { ToastContainer } from "react-toastify";
import styles from "./Home/Home.module.scss";

export default function Room({ socket, userId }) {
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
  const [voteResults, setVoteResults] = useState({});

  // let isUserHost = sessionStorage.getItem("isUserHost") === "true";
  // const location = useLocation();

  const [isHost, setHost] = useState(false);

  // const { isHosting } = location.state || {};
  // console.log(isHosting);

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

    socket.on("update-room-data", (roomData) => {
      setIsCardsRevealed(roomData?.roomInfo?.areCardsRevealed || false);
      setRoomData(roomData);
      setLeftToVoteString(getStringWhoLeftToVote(roomData));
      checkIfHostLeft(roomData, handleLeave);
      setVoteResults(getSortedResults(roomData));
    });

    socket.on("is-user-host", (isHosting) => {
      setHost(isHosting);
    });

    return () => {
      socket.off("update-room-data");
      socket.off("check-room-response");
      socket.off("is-hosting-response");
    };
  }, []);

  console.log(isHost);

  return (
    <>
      <ToastContainer className={styles.toastClass} />
      {isHost ? (
        <HostRoom
          socket={socket}
          roomData={roomData}
          isCardsRevealed={isCardsRevealed}
          handleLeave={handleLeave}
          leftToVoteString={leftToVoteString}
          voteResults={voteResults}
        />
      ) : (
        <GuestRoom
          socket={socket}
          roomData={roomData}
          isCardsRevealed={isCardsRevealed}
          handleLeave={handleLeave}
          voteResults={voteResults}
        />
      )}
    </>
  );
}
