// import styles from "./Home.module.scss";

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
    },
  },
  room: {
    leave: "Leave Room",
  },
};

export const toastSettings = {
  className: { fontSize: "16px" },
  position: "top-center",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};
