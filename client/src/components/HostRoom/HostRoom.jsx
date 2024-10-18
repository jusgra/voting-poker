import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { figureOutCardShowing, getCardAvg } from "../../utils/roomUtils";
import styles from "./HostRoom.module.scss";
import Button from "../Button/Button";
import { ButtonTypes } from "../../utils/ButtonTypes";
import { textConst } from "../../utils/constants";
import TopBar from "../TopBar/TopBar";
import IconPersonBadge from "../Icons/IconPersonBadge";
import IconRoom from "../Icons/IconRoom";
import IconCopy from "../Icons/IconCopy";

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

  return (
    <div className={styles.roomContainer}>
      <TopBar styling={styles.topBarContainer}>
        <div className={styles.leftSide}>
          <IconRoom sizeInPx={26} />
          <span>{roomData.roomInfo.hostUsername} room</span>
          <span>
            <Button />
            <IconCopy sizeInPx={24} />
          </span>
          {/* <span className={styles.roomId}><{roomId}></span> */}
        </div>
        <div>
          <span>6 users in room</span>
        </div>

        <div className={styles.rightSide}>
          <IconPersonBadge sizeInPx={26} />

          <span className={styles.username}>{username}</span>

          <Button
            onClick={handleLeave}
            styling={styles.backButton}
            buttonText={textConst.room.leave}
            type={ButtonTypes.LEAVE}
          />
        </div>
      </TopBar>
      <div className={styles.roomInfoHeader}></div>

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
