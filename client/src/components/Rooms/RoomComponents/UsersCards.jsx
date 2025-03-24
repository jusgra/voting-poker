import React from "react";
import { composeClassName } from "../../../utils/utilFunctions";

import styles from "./UsersCards.module.scss";
import VoteResults from "./VoteResults";
import SingleCard from "./SingleCard";

export default function UsersCards({ socket, roomData, isCardsRevealed, voteResults }) {
  return (
    <div className={composeClassName(styles.wrapperContainer)}>
      <div className={styles.usersContainer}>
        <div className={styles.containerHeader}>Users in room</div>
        {roomData.usersInRoom.map((userCardInfo, index) => (
          <SingleCard
            key={index}
            roomData={roomData}
            userCardInfo={userCardInfo}
            index={index}
            isCardsRevealed={isCardsRevealed}
            socket={socket}
          />
        ))}
      </div>
      {isCardsRevealed && <VoteResults roomData={roomData} voteResults={voteResults} />}
    </div>
  );
}
