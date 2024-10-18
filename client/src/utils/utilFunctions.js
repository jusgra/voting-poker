import { ButtonTypes } from "./ButtonTypes";
import IconHost from "../components/Icons/IconHost";
import IconJoin from "../components/Icons/IconJoin";
import IconLeave from "../components/Icons/IconLeave";
import IconCopy from "../components/icons/IconCopy";

export const composeClassName = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const getButtonIcon = (type, styling) => {
  switch (type) {
    case ButtonTypes.JOIN:
      return <IconJoin sizeInPx={24} styling={styling} />;
    case ButtonTypes.HOST:
      return <IconHost sizeInPx={24} styling={styling} />;
    case ButtonTypes.LEAVE:
      return <IconLeave sizeInPx={24} styling={styling} />;
    case ButtonTypes.COPY:
      return <IconCopy sizeInPx={22} styling={styling} />;
    case ButtonTypes.REVEAL:
      return <IconLeave sizeInPx={24} styling={styling} />;
    case ButtonTypes.RESET:
      return <IconLeave sizeInPx={24} styling={styling} />;
    default:
      return;
  }
};
