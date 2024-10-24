import { CARDS } from "../../../utils/constants";
import React, { useEffect, useState } from "react";
import styles from "./CardSelector.module.scss";
import { composeClassName } from "../../../utils/utilFunctions";
import { useParams } from "react-router-dom";

export default function CardSelector({ socket, isCardsRevealed }) {
  const [card, setCard] = useState("");
  const { id: roomId } = useParams();

  const handleClick = (cardNumber) => {
    if (isCardsRevealed) return;
    socket.emit("card-pick", { roomId: roomId.toString(), pickedCard: cardNumber.toString() });
    setCard(cardNumber);
  };

  useEffect(() => {
    if (!isCardsRevealed) setCard("");
  }, [isCardsRevealed]);

  return (
    <div className={styles.cardsContainer}>
      {CARDS.map((singleCard) => {
        return (
          <div
            className={composeClassName(
              styles.cardWrapper,
              isCardsRevealed && styles.disabled,
              card === singleCard ? styles.selected : isCardsRevealed && styles.done
            )}
            onClick={() => handleClick(singleCard)}
          >
            {singleCard}
          </div>
        );
      })}
    </div>
  );
}
