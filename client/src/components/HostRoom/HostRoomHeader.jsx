import { ButtonTypes } from "../../utils/ButtonTypes";
import { textConst } from "../../utils/constants";
import React from "react";
import styles from "./HostRoomHeader.module.scss";
import Button from "../Button/Button";

export default function HostRoomHeader({ isCardsRevealed, handleReveal, isRoomEmpty, leftToVoteString }) {
  return (
    <>
      <Button
        onClick={handleReveal}
        styling={isCardsRevealed ? styles.resetButton : styles.revealButton}
        buttonText={isCardsRevealed ? textConst.room.reset : textConst.room.reveal}
        type={isCardsRevealed ? ButtonTypes.RESET : ButtonTypes.REVEAL}
        disabled={!isCardsRevealed && isRoomEmpty}
      />
      <h1 className={styles.leftToVote}>{isCardsRevealed ? textConst.room.header.cardsRevealed : leftToVoteString}</h1>
    </>
  );
}
