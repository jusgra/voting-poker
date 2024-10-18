import React from "react";
import styles from "./TopBar.module.scss";
import { composeClassName } from "../../utils/utilFunctions";

export default function TopBar({ styling, children }) {
  return <div className={composeClassName(styles.topBar, styling)}>{children}</div>;
}
