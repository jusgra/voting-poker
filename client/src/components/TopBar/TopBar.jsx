import React from "react";
import styles from "./TopBar.module.scss";
import { composeClassName, replacePlaceholders } from "../../utils/utilFunctions";
import { TEXT_CONST } from "../../utils/constants";

const VERSION_NUBMER = import.meta.env?.PUBLIC_VERSION_NUBMER;

export default function TopBar({ styling, children }) {
  return (
    <>
      <div className={composeClassName(styles.topBar, styling)}>{children}</div>
      <div className={styles.versionNumber}>{replacePlaceholders(TEXT_CONST.room.version, VERSION_NUBMER)}</div>
    </>
  );
}
