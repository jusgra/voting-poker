import React from "react";
import { figureOutCardShowing, getCardAvg } from "../utils/roomUtils";
import { useParams } from "react-router-dom";
import { CARDS } from "../utils/constants";
import RoomTopBar from "./RoomTopBar/RoomTopBar";
import UsersCards from "./UsersCards";
import styles from "./GuestRoom.module.scss";
import CardSelector from "./CardSelector";

export default function GuestRoom({ socket, roomData, handleLeave, isCardsRevealed, voteResults }) {
  return (
    <>
      <RoomTopBar isHostRoom={false} handleLeave={handleLeave} roomData={roomData} />
      <div className={styles.roomContainer}>
        <h1 className={styles.header}>{isCardsRevealed ? "Voting has concluded" : "You can now vote"} </h1>
        <CardSelector roomData={roomData} isCardsRevealed={isCardsRevealed} socket={socket} />
        <UsersCards socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} voteResults={voteResults} />
      </div>
    </>
  );
}
