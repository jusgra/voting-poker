export const getCardAvg = (roomData) => {
  const cards = [];
  for (const singleUser of roomData.usersInRoom) {
    if (singleUser.card) cards.push(+singleUser.card);
  }

  const avg =
    cards.reduce((accum, single) => {
      return accum + single;
    }, 0) / cards.length;

  return avg || "no one voted :/";
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
    if (userInfo.card) {
      return userInfo.card;
    }
    return "did not vote";
  }
  if (userInfo.card) {
    return "picked";
  }
  return "yet to vote";
};

export const checkIfHostLeft = ({ roomInfo, usersInRoom }, callbackLeave) => {
  const isHostPresent = usersInRoom.some((single) => single.id === roomInfo.hostId);
  if (!isHostPresent) callbackLeave({ wasDisconnected: true });
};
