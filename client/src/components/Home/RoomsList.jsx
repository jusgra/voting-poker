import React from "react";
import styles from "./RoomList.module.scss";
import IconPersonBadge from "../Icons/IconPersonBadge";
import Button from "../Button/Button";
import { ButtonTypes } from "../../utils/ButtonTypes";
import { textConst } from "../../utils/constants";
import IconBan from "../Icons/IconBan";
import { composeClassName } from "../../utils/utilFunctions";

export default function RoomsList({ hostedRooms, roomClick }) {
  const isLobbyEmpty = hostedRooms?.length === 0;

  return (
    <>
      <h2 className={styles.header}>{textConst.home.listOfRooms}</h2>
      <div className={composeClassName(styles.tableContainer, isLobbyEmpty && styles.tableContainerNoRooms)}>
        {isLobbyEmpty ? (
          <div className={styles.noRooms}>
            {textConst.home.noRoomsCreated}
            <IconBan styling={styles.iconNoRooms} sizeInPx={80} />
          </div>
        ) : (
          <ul className={styles.roomList}>
            {hostedRooms.map((single, index) => {
              return (
                <li className={styles.roomWrapper} key={index}>
                  <IconPersonBadge styling={styles.roomIcon} sizeInPx={32} />
                  <span className={styles.roomName}>{single.hostUsername} room</span>
                  <Button
                    onClick={() => roomClick(single.roomId)}
                    buttonText={textConst.home.joinButton}
                    type={ButtonTypes.JOIN}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
