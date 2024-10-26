import React from "react";
import styles from "./GuestRoom.module.scss";
import RoomTopBar from "../RoomComponents/RoomTopBar";
import CardSelector from "../RoomComponents/CardSelector";
import UsersCards from "../RoomComponents/UsersCards";
import { TEXT_CONST } from "../../../utils/constants";

export default function GuestRoom({ socket, roomData, handleLeave, isCardsRevealed, voteResults }) {
  return (
    <>
      <RoomTopBar isHostRoom={false} handleLeave={handleLeave} roomData={roomData} />
      <h1 className={styles.header}>{isCardsRevealed ? TEXT_CONST.room.votingEnded : TEXT_CONST.room.voteNow} </h1>
      <CardSelector isCardsRevealed={isCardsRevealed} socket={socket} />
      <UsersCards socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} voteResults={voteResults} />
    </>
  );
}
