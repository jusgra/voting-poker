import React from "react";
import { figureOutCardShowing, getCardAvg } from "../utils/roomUtils";
import { useParams } from "react-router-dom";
import { CARDS } from "../utils/constants";

export default function GuestRoom({ socket, roomData, handleLeave, isCardsRevealed }) {
  const username = sessionStorage.getItem("username");

  const { id: roomId } = useParams();

  const handleCardPick = (card) => {
    if (isCardsRevealed) return;
    socket.emit("card-pick", { roomId: roomId.toString(), pickedCard: card.toString() });
  };

  return (
    <>
      <h1>You are a GUEST</h1>
      <button onClick={handleLeave}>BACK HOME</button>
      {CARDS.map((single, index) => {
        return (
          <button key={index} onClick={() => handleCardPick(single)}>
            {single}
          </button>
        );
      })}
      <h1>your id = {socket.id}</h1>
      <h1>your name = {username}</h1>
      <h2 style={{ color: "red" }}>HOST IS - {roomData.roomInfo.hostUsername}</h2>
      {roomData.usersInRoom.map((userInfo, index) => {
        return (
          <div key={index}>
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
