import { figureOutCardShowing, getCardStatus } from "../../../utils/roomUtils";
import React from "react";
import IconDidntVote from "../../Icons/IconDidntVote";
import { TEXT_CONST } from "../../../utils/constants";
import IconVoting from "../../Icons/IconVoting";
import IconVoted from "../../Icons/IconVoted";
import { composeClassName } from "../../../utils/utilFunctions";
import styles from "./SingleCard.module.scss";

export default function SingleCard({ roomData, userCardInfo, isCardsRevealed, index, socket }) {
  const currentCard = figureOutCardShowing(userCardInfo, isCardsRevealed);
  const cardStatus = getCardStatus(currentCard);
  const isMyCard = socket.id === userCardInfo.id;

  const cardClassName = composeClassName(
    styles.cardWrapper,
    cardStatus.hasVoted && styles.voted,
    cardStatus.hasNotVoted && styles.didntVote,
    isMyCard && styles.myCard
  );

  if (roomData.roomInfo.hostId !== userCardInfo.id)
    return (
      <div key={index} className={styles.userWrapper}>
        <p className={composeClassName(styles.username, isMyCard && styles.myName)}>{userCardInfo.username}</p>

        <div key={index} className={cardClassName}>
          {cardStatus.hasToVote && <IconVoting sizeInPx={42} />}
          {cardStatus.hasVoted && <IconVoted sizeInPx={42} />}
          {cardStatus.hasNotVoted && (
            <>
              <IconDidntVote sizeInPx={42} />
              <span className={styles.userSkipped}>{TEXT_CONST.room.didNotVote}</span>
            </>
          )}
          {cardStatus.isVoteRevealed && <span>{userCardInfo.card}</span>}
        </div>
      </div>
    );
}
