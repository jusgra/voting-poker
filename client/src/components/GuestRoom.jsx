import React, { useEffect } from "react";
import { figureOutCardShowing, getCardAvg } from "./roomUtils";
import { useParams } from "react-router-dom";

export default function GuestRoom({ socket, roomData, handleLeave, isCardsRevealed }) {
  const CARDS = [1, 2, 3, 5, 8, 13, "?"];
  const username = sessionStorage.getItem("username");
  const { id: roomId } = useParams();

  if (!username) console.log("WHATS YOUR NAME");

  const handleCardPick = (card) => {
    if (isCardsRevealed) return;
    socket.emit("card-pick", { roomId: roomId.toString(), pickedCard: card.toString() });
  };

  useEffect(() => {
    socket.emit("join-room", { roomId, username });
  }, []);

  return (
    <>
      <h1>You are a GUEST</h1>
      <button onClick={handleLeave}>BACK HOME</button>
      {CARDS.map((single) => {
        return <button onClick={() => handleCardPick(single)}>{single}</button>;
      })}
      <h1>your id = {socket.id}</h1>
      <h1>your name = {username}</h1>
      <h2>
        You are in room {roomId} and the host is - {roomData.roomInfo.hostId}
      </h2>
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
