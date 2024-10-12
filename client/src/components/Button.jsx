import styles from "./Button.module.scss";
import React from "react";
import { composeClassName, getButtonIcon } from "../utilFunction";

export default function Button({ onClick, styling, buttonText, type }) {
  return (
    <button className={composeClassName(styles.roomButton, styling)} onClick={onClick}>
      <div className={styles.buttonIcon}>{getButtonIcon(type)}</div>
      <span className={styles.buttonText}>{buttonText}</span>
    </button>
  );
}
