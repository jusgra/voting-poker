import { ButtonTypes } from "./ButtonTypes";
import IconHost from "./components/icons/IconHost";
import IconJoin from "./components/icons/IconJoin";

export const composeClassName = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const getButtonIcon = (type) => {
  switch (type) {
    case ButtonTypes.JOIN:
      return <IconJoin />;
    case ButtonTypes.HOST:
      return <IconHost />;
    default:
      return;
  }
};
