export const textConst = {
  home: {
    placeholder: "What is your name?",
    listOfRooms: "List of hosted rooms",
    joinButton: "Join room",
    hostButton: "Host room",
    noRoomsCreated: "No rooms are created at the moment",
    toasts: {
      whatsYourName: "Please let us know your name",
      hostLeft: "Host has left the room, you were disconnected",
      copySuccess: "Copy link has been copied to your clipboard",
      noRoom: "There is no such room, or it was closed already",
    },
  },
  room: {
    leave: "Leave Room",
    copy: "Copy Invite Link",
    participants: "Participants:",
    reveal: "Reveal cards",
    reset: "Reset voting",
    didNotVote: "Did not vote",
    result: ["has been voted", "time"],
    average: "Voting average:",
    noVotes: "None of the users participated in this vote",
    header: {
      cardsRevealed: "Cards are now revealed",
      waitingForMany: "Waiting for {0} players to vote",
      waitingForOne: "Waiting for {0} to vote",
      allVoted: "Everyone has voted",
      roomEmpty: "Invite people to your room",
    },
  },
};

export const toastSettings = {
  position: "top-center",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};

export const CARDS = [1, 2, 3, 5, 8, 13, "?"];
