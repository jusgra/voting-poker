import React from "react";
import styles from "./RoomList.module.scss";

export default function RoomsList({ hostedRooms, roomClick }) {
  return (
    <>
      <h2 className={styles.header}>List of hosted rooms</h2>
        <div className={styles.tableContainer}>


      <ul className={styles.roomList}>
        {hostedRooms?.length !== 0 ? (
          hostedRooms.map((single) => {
            return (
              <div>
                {single.hostUsername}'s room <button onClick={() => roomClick(single.roomId)}>Join</button>
              </div>
            );
          })
        ) : (
          <div>No rooms are created at the moment</div>
        )}
      </ul></div>
    </>
  );
}
