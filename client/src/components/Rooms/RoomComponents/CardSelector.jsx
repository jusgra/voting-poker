import { CARDS } from "../../../utils/constants";
import React, { useEffect, useState } from "react";
import styles from "./CardSelector.module.scss";
import { composeClassName } from "../../../utils/utilFunctions";
import { useParams } from "react-router-dom";

export default function CardSelector({ socket, isCardsRevealed }) {
  const [userSelectedCard, setUserSelectedCard] = useState("");
  const { id: roomId } = useParams();

  const handleClick = (cardNumber) => {
    if (isCardsRevealed) return;
    socket.emit("card-pick", { roomId: roomId.toString(), pickedCard: cardNumber.toString() });
    setUserSelectedCard(cardNumber);
  };

  useEffect(() => {
    if (!isCardsRevealed) setUserSelectedCard("");
  }, [isCardsRevealed]);

  return (
    <div className={styles.cardsContainer}>
      {CARDS.map((card) => {
        return (
          <div
            className={composeClassName(
              styles.cardWrapper,
              isCardsRevealed && styles.disabled,
              userSelectedCard === card ? styles.selected : isCardsRevealed && styles.done
            )}
            onClick={() => handleClick(card)}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
}
