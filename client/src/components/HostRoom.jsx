import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { figureOutCardShowing, getCardAvg } from "./roomUtils";

export default function HostRoom({ socket, roomData, handleLeave, isCardsRevealed }) {
  const { id: roomId } = useParams();
  const username = sessionStorage.getItem("username");

  if (!username) console.log("WHATS YOUR NAME");

  console.log(roomData);

  const handleReveal = () => {
    if (isCardsRevealed) {
      socket.emit("card-reveal-toggle", { roomId, action: "RESET" });
      return;
    }
    socket.emit("card-reveal-toggle", { roomId, action: "REVEAL" });
  };

  useEffect(() => {
    // socket.emit("ask-to-join", { roomId: "qwerty", isHosting: true });
    socket.emit("join-room", { roomId, username });
  }, []);

  return (
    <>
      <h1>You are a HOST</h1>
      <button onClick={handleLeave}>BACK HOME</button>
      {isCardsRevealed ? (
        <button onClick={handleReveal}>Reset Cards</button>
      ) : (
        <button onClick={handleReveal}>Reveal Cards</button>
      )}

      <h1>your id = {socket.id}</h1>
      <h1>your name = {username}</h1>
      {roomData.usersInRoom.map((userInfo) => {
        return (
          <div>
            {roomData.roomInfo.hostId !== userInfo.id && (
              <span>
                {userInfo.username} {userInfo.id} = {figureOutCardShowing(userInfo, isCardsRevealed)}
              </span>
            )}
          </div>
        );
      })}
      {isCardsRevealed && getCardAvg(roomData)}
    </>
  );
}
