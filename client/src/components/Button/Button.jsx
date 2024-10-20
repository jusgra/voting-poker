import styles from "./Button.module.scss";
import React from "react";
import { composeClassName, getButtonIcon } from "../../utils/utilFunctions";
import IconJoin from "../Icons/IconJoin";

export default function Button({ onClick, styling, buttonText, type, disabled = false }) {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <button
      className={composeClassName(styles.buttonContainer, disabled ? styles.disabled : styles.enabled, styling)}
      onClick={handleClick}
    >
      <div className={styles.buttonWrapper}>
        {getButtonIcon(type, styles.buttonIcon)}
        <span className={styles.buttonText}>{buttonText}</span>
      </div>
    </button>
  );
}
