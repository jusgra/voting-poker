import { ButtonTypes } from "./ButtonTypes";
import IconHost from "../components/Icons/IconHost";
import IconJoin from "../components/Icons/IconJoin";
import IconHome from "../components/Icons/IconHome";

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
      return <IconHome sizeInPx={22} styling={styling} />;
    case ButtonTypes.REVEAL:
      return <IconHome sizeInPx={24} styling={styling} />;
    case ButtonTypes.RESET:
      return <IconHome sizeInPx={24} styling={styling} />;
    default:
      return;
  }
};
