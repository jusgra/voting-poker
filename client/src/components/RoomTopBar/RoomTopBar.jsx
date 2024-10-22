import { toast } from "react-toastify";
import { textConst, toastSettings } from "../../utils/constants";
import Button from "../Button/Button";
import IconPersonBadge from "../Icons/IconPersonBadge";
import IconRoom from "../Icons/IconRoom";
import TopBar from "../TopBar/TopBar";
import styles from "./RoomTopBar.module.scss";
import React from "react";
import { ButtonTypes } from "../../utils/ButtonTypes";

export default function RoomTopBar({ handleCopyClick, isHostRoom, handleLeave, roomData }) {
  const username = sessionStorage.getItem("username");

  return (
    <TopBar styling={styles.topBarContainer}>
      <div className={styles.leftSide}>
        {isHostRoom && <Button onClick={handleCopyClick} buttonText={textConst.room.copy} type={ButtonTypes.COPY} />}
        <IconRoom sizeInPx={36} />
        <span className={styles.hostUsername}>{roomData.roomInfo.hostUsername} room</span>
      </div>
      <div className={styles.middle}>
        <span>{textConst.room.participants}</span>
        <span className={styles.usersNumber}>{roomData.usersInRoom.length - 1}</span>
      </div>

      <div className={styles.rightSide}>
        <IconPersonBadge sizeInPx={36} />

        <span className={styles.username}>{username}</span>

        <Button
          onClick={handleLeave}
          styling={styles.backButton}
          buttonText={textConst.room.leave}
          type={ButtonTypes.LEAVE}
        />
      </div>
    </TopBar>
  );
}
