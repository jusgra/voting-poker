import { BUTTON_TYPES } from "../../../utils/ButtonTypes";
import { TEXT_CONST } from "../../../utils/constants";
import React from "react";
import styles from "./HostRoomHeader.module.scss";
import Button from "../../Button/Button";

export default function HostRoomHeader({ isCardsRevealed, handleReveal, isRoomEmpty, leftToVoteString }) {
  return (
    <>
      <Button
        onClick={handleReveal}
        styling={isCardsRevealed ? styles.resetButton : styles.revealButton}
        buttonText={isCardsRevealed ? TEXT_CONST.room.reset : TEXT_CONST.room.reveal}
        type={isCardsRevealed ? BUTTON_TYPES.RESET : BUTTON_TYPES.REVEAL}
        disabled={!isCardsRevealed && isRoomEmpty}
      />
      <h1 className={styles.leftToVote}>{isCardsRevealed ? TEXT_CONST.room.header.cardsRevealed : leftToVoteString}</h1>
    </>
  );
}
