import React from "react";
import { composeClassName } from "../utils/utilFunctions";
import { getCardAvg } from "../utils/roomUtils";
import styles from "./VoteResults.module.scss";
import { textConst } from "../utils/constants";

export default function VoteResults({ roomData, voteResults }) {
  const hasSomeoneVoted = roomData.usersInRoom.some((single) => single.card);

  return (
    <>
      <div className={styles.divider} />

      <div className={composeClassName(styles.resultContainer, !hasSomeoneVoted && styles.empty)}>
        <div className={styles.votesContainer}>
          {Object.entries(voteResults).map(([key, value]) => (
            <div key={key} className={styles.singleResult}>
              <div className={styles.resultCard}>{key}</div>
              <span>
                {textConst.room.result[0]} <span className={styles.resultValue}>{value}</span> {textConst.room.result[1]}
                {value > 1 && "s"}.
              </span>
            </div>
          ))}
        </div>

        <div className={styles.averageContainer}>
          {hasSomeoneVoted ? (
            <>
              <span className={styles.text}>{textConst.room.average}</span>
              <span className={styles.number}>{getCardAvg(roomData)}</span>
            </>
          ) : (
            <span className={styles.noVotes}> {textConst.room.noVotes}</span>
          )}
        </div>
      </div>
    </>
  );
}
