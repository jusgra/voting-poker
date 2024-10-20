import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import RoomsList from "./RoomsList";
import styles from "./Home.module.scss";
import Button from "../Button/Button";
import { ButtonTypes } from "../../utils/ButtonTypes";
import { textConst, toastSettings } from "../../utils/constants";
import { getUsername } from "../../utils/roomUtils";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "../TopBar/TopBar";

export default function Home({ socket }) {
  const [hostedRooms, setHostedRooms] = useState([]);
  const [usernameValue, setUsernameValue] = useState(getUsername());
  const location = useLocation();
  const navigator = useNavigate();

  const handleChange = (e) => {
    setUsernameValue(e.target.value);
  };

  const handleRoomJoin = (isHostingRoom, clickedRoomId) => {
    if (!usernameValue) {
      toast.error(textConst.home.toasts.whatsYourName, toastSettings);
      return;
    }
    sessionStorage.setItem("isUserHost", isHostingRoom);
    sessionStorage.setItem("username", usernameValue);

    const roomId = isHostingRoom ? uuidv4() : clickedRoomId;
    if (isHostingRoom) {
      socket.emit("host-room", { roomId, username: usernameValue });
    }
    navigator(`/room/${roomId}`);
  };

  useEffect(() => {
    socket.emit("get-hosted-rooms");

    socket.on("update-room-list", (data) => {
      setHostedRooms(data);
    });

    return () => {
      socket.off("update-room-list");
    };
  }, []);

  useEffect(() => {
    let timeoutId;
    const { gotDisconnected, roomNotHosted } = location.state || {};

    if (gotDisconnected || roomNotHosted) {
      timeoutId = setTimeout(() => {
        const message = gotDisconnected ? textConst.home.toasts.hostLeft : textConst.home.toasts.noRoom;
        toast.warning(message, toastSettings);
        navigator(".", { replace: true, state: { gotDisconnected: false, roomNotHosted: false } });
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <ToastContainer className={styles.toastClass} />
      <TopBar>
        <div className={styles.topText}>Lobby</div>
      </TopBar>

      <div className={styles.usernameWrapper}>
        <input
          className={styles.usernameInput}
          placeholder={textConst.home.placeholder}
          onChange={handleChange}
          value={usernameValue}
        ></input>
      </div>
      <div className={styles.roomListWrapper}>
        <RoomsList hostedRooms={hostedRooms} roomClick={(id) => handleRoomJoin(false, id)} />
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={() => handleRoomJoin(true)} buttonText={textConst.home.hostButton} type={ButtonTypes.HOST} />
      </div>
    </div>
  );
}
