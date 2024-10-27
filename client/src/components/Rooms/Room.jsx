import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import HostRoom from "./HostRoom/HostRoom";
import { checkIfHostLeft, getSortedResults, getStringWhoLeftToVote } from "../../utils/roomUtils";
import { ToastContainer } from "react-toastify";
import homeStyles from "./Home/Home.module.scss";
import roomStyles from "./Room.module.scss";
import GuestRoom from "./GuestRoom/GuestRoom";

export default function Room({ socket }) {
  const { id: roomId } = useParams();
  const navigator = useNavigate();
  const [roomData, setRoomData] = useState({ roomInfo: {}, usersInRoom: [] });
  const [isCardsRevealed, setIsCardsRevealed] = useState(false);
  const [leftToVoteString, setLeftToVoteString] = useState("");
  const [voteResults, setVoteResults] = useState({});
  const [isHost, setHost] = useState(null);
  let storageUsername = localStorage.getItem("username");

  const handleLeave = (status) => {
    socket.emit("leave-room", roomId);
    navigator("/", { state: { gotDisconnected: status?.wasDisconnected } });
  };

  useEffect(() => {
    socket.emit("check-room", roomId);

    socket.on("check-room-response", ({ isAllowedToJoin }) => {
      if (isAllowedToJoin) {
        while (!storageUsername) {
          storageUsername = prompt("Enter Your Name:");
          localStorage.setItem("username", storageUsername);
        }
        socket.emit("join-room", { roomId, username: storageUsername });

        return;
      }
      navigator("/", { state: { roomNotHosted: true } });
    });

    socket.on("update-room-data", (roomData) => {
      setIsCardsRevealed(roomData?.roomInfo?.areCardsRevealed || false);
      setLeftToVoteString(getStringWhoLeftToVote(roomData));
      if (!roomData?.roomInfo?.areCardsRevealed) {
        //after vote has concluded, players leaving will not update room data
        setRoomData(roomData);
        setVoteResults(getSortedResults(roomData));
      }
      checkIfHostLeft(roomData, handleLeave);
    });

    socket.on("join-room-response", ({ isHosting, roomData }) => {
      if (roomData?.roomInfo?.areCardsRevealed) {
        //joining into session after vote has concluded
        setRoomData(roomData);
        setVoteResults(getSortedResults(roomData));
      }
      setHost(isHosting);
    });

    return () => {
      socket.off("update-room-data");
      socket.off("check-room-response");
      socket.off("is-hosting-response");
    };
  }, []);

  if (isHost === null) return null;

  return (
    <>
      <ToastContainer className={homeStyles.toastClass} />
      <div className={roomStyles.roomContainer}>
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
      </div>
    </>
  );
}
