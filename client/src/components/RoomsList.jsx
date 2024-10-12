import React from "react";
import styles from "./RoomList.module.scss";
import IconPersonBadge from "./icons/IconPersonBadge";
import Button from "./Button";
import { ButtonTypes } from "../ButtonTypes";
import { Text } from "./textConstants";
import IconBan from "./icons/IconBan";
import { composeClassName } from "../utilFunction";

export default function RoomsList({ hostedRooms, roomClick }) {
  const isLobbyEmpty = hostedRooms?.length === 0;

  return (
    <>
      <h2 className={styles.header}>{Text.Home.ListOfRooms}</h2>
      <div className={composeClassName(styles.tableContainer, isLobbyEmpty && styles.tableContainerNoRooms)}>
        {isLobbyEmpty ? (
          <div className={styles.noRooms}>
            {Text.Home.NoRoomsCreated}
            <IconBan styling={styles.iconNoRooms} sizeInPx={90} />
          </div>
        ) : (
          <ul className={styles.roomList}>
            {hostedRooms.map((single) => {
              return (
                <li className={styles.roomWrapper}>
                  <IconPersonBadge styling={styles.roomIcon} sizeInPx={26} />
                  <span className={styles.roomName}>{single.hostUsername}</span>
                  <Button
                    onClick={() => roomClick(single.roomId)}
                    buttonText={Text.Home.JoinButton}
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
