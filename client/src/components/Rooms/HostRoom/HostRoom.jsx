import React from "react";
import { useParams } from "react-router-dom";
import styles from "./HostRoom.module.scss";
import Button from "../../Button/Button";
import { BUTTON_TYPES } from "../../../utils/ButtonTypes";
import { TEXT_CONST, TOAST_SETTINGS } from "../../../utils/constants";
import { toast } from "react-toastify";
import { composeClassName } from "../../../utils/utilFunctions";
import RoomTopBar from "../RoomComponents/RoomTopBar";
import HostRoomHeader from "./HostRoomHeader";
import UsersCards from "../RoomComponents/UsersCards";

export default function HostRoom({ socket, roomData, handleLeave, isCardsRevealed, leftToVoteString, voteResults }) {
  const { id: roomId } = useParams();
  console.log("rendering host room");

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
      toast.info(TEXT_CONST.home.toasts.copySuccess, { ...TOAST_SETTINGS, hideProgressBar: true, autoClose: 1000 });
    });
  };

  return (
    <>
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
            buttonText={TEXT_CONST.room.copy}
            type={BUTTON_TYPES.COPY}
          />
        </div>
      ) : (
        <UsersCards socket={socket} roomData={roomData} isCardsRevealed={isCardsRevealed} voteResults={voteResults} />
      )}
    </>
  );
}
