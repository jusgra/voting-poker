import { BUTTON_TYPES } from "./ButtonTypes";
import IconHost from "../components/Icons/IconHost";
import IconJoin from "../components/Icons/IconJoin";
import IconLeave from "../components/Icons/IconLeave";
import IconCopy from "../components/icons/IconCopy";
import IconReveal from "../components/Icons/IconReveal";
import IconReset from "../components/Icons/IconReset";
import React from "react";

export const composeClassName = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const replacePlaceholders = (str, ...args) => {
  return str.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== "undefined" ? args[index] : match;
  });
};

export const getButtonIcon = (type, styling) => {
  switch (type) {
    case BUTTON_TYPES.JOIN:
      return <IconJoin sizeInPx={24} styling={styling} />;
    case BUTTON_TYPES.HOST:
      return <IconHost sizeInPx={24} styling={styling} />;
    case BUTTON_TYPES.LEAVE:
      return <IconLeave sizeInPx={24} styling={styling} />;
    case BUTTON_TYPES.COPY:
      return <IconCopy sizeInPx={22} styling={styling} />;
    case BUTTON_TYPES.REVEAL:
      return <IconReveal sizeInPx={24} styling={styling} />;
    case BUTTON_TYPES.RESET:
      return <IconReset sizeInPx={24} styling={styling} />;
    default:
      return;
  }
};
