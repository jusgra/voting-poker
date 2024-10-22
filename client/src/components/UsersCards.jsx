import React from "react";
import { CARD_CONSTS, figureOutCardShowing, getCardAvg } from "../utils/roomUtils";
import { composeClassName } from "../utils/utilFunctions";
import IconVoting from "./Icons/IconVoting";
import IconVoted from "./Icons/IconVoted";
import IconDidntVote from "./Icons/IconDidntVote";
import { textConst } from "../utils/constants";

import styles from "./UsersCards.module.scss";

export default function UsersCards({ socket, roomData, isCardsRevealed, voteResults }) {
  const hasSomeoneVoted = roomData.usersInRoom.some((single) => single.card);

  console.log(socket?.id);

  return (
    <div className={composeClassName(styles.wrapperContainer)}>
      <div className={styles.usersContainer}>
        <div className={styles.containerHeader}>Users in room</div>
        {roomData.usersInRoom.map((userInfo, index) => {
          const currentCard = figureOutCardShowing(userInfo, isCardsRevealed);
          const isMyCard = socket.id === userInfo.id;
          return (
            roomData.roomInfo.hostId !== userInfo.id && (
              <div key={index} className={styles.userWrapper}>
                <p className={composeClassName(styles.username, isMyCard && styles.myName)}>{userInfo.username}</p>

                <div
                  key={index}
                  className={composeClassName(
                    styles.cardWrapper,
                    // currentCard === CARD_CONSTS.YET_TO_VOTE && styles.voting,
                    currentCard === CARD_CONSTS.VOTED && styles.voted,
                    currentCard === CARD_CONSTS.DID_NOT_VOTE && styles.didntVote,
                    isMyCard && styles.myCard
                  )}
                >
                  {currentCard === CARD_CONSTS.YET_TO_VOTE && <IconVoting sizeInPx={42} />}
                  {currentCard === CARD_CONSTS.VOTED && <IconVoted sizeInPx={42} />}
                  {currentCard === CARD_CONSTS.DID_NOT_VOTE && (
                    <>
                      <IconDidntVote sizeInPx={42} />
                      <span className={styles.userSkipped}>{textConst.room.didNotVote}</span>
                    </>
                  )}
                  {currentCard === CARD_CONSTS.SHOW_CARD && <span>{userInfo.card}</span>}
                </div>
              </div>
            )
          );
        })}
      </div>
      {isCardsRevealed && (
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
      )}
    </div>
  );
}
