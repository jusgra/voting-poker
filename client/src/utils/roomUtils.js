import { textConst } from "./constants";
import { replacePlaceholders } from "./utilFunctions";

export const CARD_CONSTS = {
  VOTE_REVEALED: "VOTE_REVEALED",
  VOTED: "VOTED",
  YET_TO_VOTE: "YET_TO_VOTE",
  DID_NOT_VOTE: "DID_NOT_VOTE",
};

export const getCardAvg = (roomData) => {
  const cards = [];
  for (const singleUser of roomData.usersInRoom) {
    if (singleUser.card) cards.push(+singleUser.card);
  }

  const filteredCards = cards.filter((single) => {
    return single !== null && !isNaN(single);
  });

  const avg =
    filteredCards.reduce((accum, single) => {
      return !isNaN(single) && accum + single;
    }, 0) / filteredCards.length;

  return Math.round(avg * 10) / 10;
};

export const getUsername = () => {
  const users = [
    "Liam",
    "Noah",
    "Elijah",
    "James",
    "Benjamin",
    "Lucas",
    "Mason",
    "Ethan",
    "Alexander",
    "Henry",
    "William",
    "Michael",
    "Daniel",
    "Matthew",
    "Sebastian",
    "Jack",
    "Samuel",
    "David",
    "Joseph",
    "Logan",
    "Christopher",
    "Andrew",
    "Owen",
    "Gabriel",
    "Nathan",
    "Dylan",
    "Caleb",
    "Ryan",
    "Isaac",
    "Luke",
    "Anthony",
    "Thomas",
    "Joshua",
    "Charles",
    "Connor",
    "Nicholas",
    "Dominic",
    "Julian",
    "Jonathan",
    "Christian",
  ];
  return users[Math.floor(Math.random() * 20)];
};

export const figureOutCardShowing = (userInfo, isCardsRevealed) => {
  if (isCardsRevealed) {
    return userInfo.card ? CARD_CONSTS.VOTE_REVEALED : CARD_CONSTS.DID_NOT_VOTE;
  }
  return userInfo.card ? CARD_CONSTS.VOTED : CARD_CONSTS.YET_TO_VOTE;
};

export const getCardStatus = (currentCard) => {
  const hasVoted = currentCard === CARD_CONSTS.VOTED;
  const hasNotVoted = currentCard === CARD_CONSTS.DID_NOT_VOTE;
  const hasToVote = currentCard === CARD_CONSTS.YET_TO_VOTE;
  const isVoteRevealed = currentCard === CARD_CONSTS.VOTE_REVEALED;
  return { hasVoted, hasNotVoted, hasToVote, isVoteRevealed };
};

export const checkIfHostLeft = ({ roomInfo, usersInRoom }, callbackLeave) => {
  const isHostPresent = usersInRoom.some((single) => single.id === roomInfo.hostId);
  if (!isHostPresent) callbackLeave({ wasDisconnected: true });
};

export const getSortedResults = (roomData) => {
  const frequencyObject = {};
  roomData.usersInRoom.forEach((user) => {
    if (user.card) {
      if (frequencyObject[user.card]) frequencyObject[user.card] += 1;
      else frequencyObject[user.card] = 1;
    }
  });
  return frequencyObject;
};

export const getStringWhoLeftToVote = (roomData) => {
  const playersThatDidNotVote = roomData.usersInRoom.filter((single) => {
    if (!single.card) return single.id !== roomData.roomInfo.hostId;
  });

  if (playersThatDidNotVote.length > 1)
    return replacePlaceholders(textConst.room.header.waitingForMany, playersThatDidNotVote.length);
  if (playersThatDidNotVote.length === 1)
    return replacePlaceholders(textConst.room.header.waitingForOne, playersThatDidNotVote[0].username);
  if (roomData.usersInRoom.length <= 1) return textConst.room.header.roomEmpty;
  return textConst.room.header.allVoted;
};
