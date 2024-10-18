import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { figureOutCardShowing, getCardAvg } from "../../utils/roomUtils";
import styles from "./HostRoom.module.scss";
import Button from "../Button/Button";
import { ButtonTypes } from "../../utils/ButtonTypes";
import {textConst, toastSettings} from "../../utils/constants";
import TopBar from "../TopBar/TopBar";
import IconPersonBadge from "../Icons/IconPersonBadge";
import IconRoom from "../Icons/IconRoom";
import {toast} from "react-toastify";

export default function HostRoom({ socket, roomData, handleLeave, isCardsRevealed }) {
  const { id: roomId } = useParams();
  const username = sessionStorage.getItem("username");

  if (!username) console.log("WHATS YOUR NAME");

  const handleReveal = () => {
    if (isCardsRevealed) {
      socket.emit("card-reveal-toggle", { roomId, action: "RESET" });
      return;
    }
    socket.emit("card-reveal-toggle", { roomId, action: "REVEAL" });
  };

  console.log(roomData);

  useEffect(() => {
    socket.emit("join-room", { roomId, username });
  }, []);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.info(textConst.home.toasts.copySuccess, {...toastSettings, hideProgressBar: true, autoClose: 1000});
    });
  }

  return (
    <div className={styles.roomContainer}>
      <TopBar styling={styles.topBarContainer}>
        <div className={styles.leftSide}>
          <Button onClick={handleCopyClick} buttonText={textConst.room.copy} type={ButtonTypes.COPY}/>
          <IconRoom sizeInPx={36} />
          <span className={styles.hostUsername}>{roomData.roomInfo.hostUsername} room</span>
        </div>
        <div className={styles.middle}>
          <span>users in room: </span>
          <span className={styles.usersNumber}>{roomData.usersInRoom.length}</span>
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

      {isCardsRevealed ? (
        <button onClick={handleReveal}>Reset Cards</button>
      ) : (
        <button onClick={handleReveal}>Reveal Cards</button>
      )}

      <h1>your id = {socket.id}</h1>
      <h1>your name = {username}</h1>
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
    </div>
  );
}
