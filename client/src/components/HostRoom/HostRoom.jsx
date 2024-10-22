import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getSortedResults } from "../../utils/roomUtils";
import styles from "./HostRoom.module.scss";
import Button from "../Button/Button";
import { ButtonTypes } from "../../utils/ButtonTypes";
import { textConst, toastSettings } from "../../utils/constants";
import { toast } from "react-toastify";
import { composeClassName } from "../../utils/utilFunctions";
import RoomTopBar from "../RoomTopBar/RoomTopBar";
import HostRoomHeader from "./HostRoomHeader";
import UsersCards from "../UsersCards";

export default function HostRoom({ socket, roomData, handleLeave, isCardsRevealed, leftToVoteString, voteResults }) {
  const { id: roomId } = useParams();

  const isRoomEmpty = roomData.usersInRoom.length <= 1;

  const handleReveal = () => {
    if (isCardsRevealed) {
      socket.emit("card-reveal-toggle", { roomId, action: "RESET" });
      return;
    }
    socket.emit("card-reveal-toggle", { roomId });
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.info(textConst.home.toasts.copySuccess, { ...toastSettings, hideProgressBar: true, autoClose: 1000 });
    });
  };

  return (
    <div className={styles.roomContainer}>
      <RoomTopBar isHostRoom={true} handleLeave={handleLeave} handleCopyClick={handleCopyClick} roomData={roomData} />

      <HostRoomHeader
        isCardsRevealed={isCardsRevealed}
        isRoomEmpty={isRoomEmpty}
        handleReveal={handleReveal}
        leftToVoteString={leftToVoteString}
      />

      {isRoomEmpty ? (
        <div className={composeClassName(styles.wrapperContainer, styles.emptyWrapper)}>
          <div className={styles.url}>{window.location.href}</div>
          <Button
            styling={styles.button}
            onClick={handleCopyClick}
            buttonText={textConst.room.copy}
            type={ButtonTypes.COPY}
          />
        </div>
      ) : (
        <UsersCards socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} voteResults={voteResults} />
      )}
    </div>
  );
}
