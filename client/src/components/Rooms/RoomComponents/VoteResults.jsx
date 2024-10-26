import React from "react";
import { composeClassName } from "../../../utils/utilFunctions";
import { getCardAvg } from "../../../utils/roomUtils";
import styles from "./VoteResults.module.scss";
import { TEXT_CONST } from "../../../utils/constants";
import IconDidntVote from "../../Icons/IconDidntVote";

export default function VoteResults({ roomData, voteResults }) {
  const hasSomeoneVoted = roomData.usersInRoom.some((single) => single.card);
  const votesAvg = getCardAvg(roomData);

  return (
    <>
      <div className={styles.divider} />
      <div className={composeClassName(styles.resultContainer, !hasSomeoneVoted && styles.empty)}>
        {hasSomeoneVoted && (
          <div className={styles.votesContainer}>
            {Object.entries(voteResults).map(([key, value]) => (
              <div key={key} className={styles.singleResult}>
                <div className={styles.resultCard}>{key !== "skip" ? key : <IconDidntVote sizeInPx={16} />}</div>
                {key === "skip" ? (
                  <span>
                    <span className={styles.resultValue}>{value}</span>
                    {TEXT_CONST.room.result[2]}
                  </span>
                ) : (
                  <span>
                    {TEXT_CONST.room.result[0]}
                    <span className={styles.resultValue}>{value}</span>
                    {TEXT_CONST.room.result[1]}
                    {value > 1 && "s"}.
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={styles.averageContainer}>
          {hasSomeoneVoted ? (
            <>
              <span className={styles.text}>{TEXT_CONST.room.average}</span>
              <span className={styles.number}>{votesAvg ? votesAvg : "?"}</span>
            </>
          ) : (
            <span className={styles.noVotes}> {TEXT_CONST.room.noVotes}</span>
          )}
        </div>
      </div>
    </>
  );
}
