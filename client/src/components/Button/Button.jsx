import styles from "./Button.module.scss";
import React from "react";
import { composeClassName, getButtonIcon } from "../../utils/utilFunctions";
import IconJoin from "../Icons/IconJoin";

export default function Button({ onClick, styling, buttonText, type }) {
  return (
    <button className={composeClassName(styles.buttonContainer, styling)} onClick={onClick}>
      <div className={styles.buttonWrapper}>
        {getButtonIcon(type, styles.buttonIcon)}
        <span className={styles.buttonText}>{buttonText}</span>
      </div>
    </button>
  );
}
