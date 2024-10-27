import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import RoomsList from "./RoomsList";
import styles from "./Home.module.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TEXT_CONST, TOAST_SETTINGS } from "../../../utils/constants";
import TopBar from "../../TopBar/TopBar";
import Button from "../../Button/Button";
import { BUTTON_TYPES } from "../../../utils/ButtonTypes";

export default function Home({ socket }) {
  const [hostedRooms, setHostedRooms] = useState([]);

  const storageUsername = localStorage.getItem("username");
  const [usernameValue, setUsernameValue] = useState(storageUsername);
  const location = useLocation();
  const navigator = useNavigate();

  const handleChange = (e) => {
    setUsernameValue(e.target.value);
  };

  const handleRoomJoin = (isHostingRoom, clickedRoomId) => {
    if (!usernameValue) {
      toast.error(TEXT_CONST.home.toasts.whatsYourName, TOAST_SETTINGS);
      return;
    }
    localStorage.setItem("username", usernameValue);

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
        const message = gotDisconnected ? TEXT_CONST.home.toasts.hostLeft : TEXT_CONST.home.toasts.noRoom;
        toast.warning(message, TOAST_SETTINGS);
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
          placeholder={TEXT_CONST.home.placeholder}
          onChange={handleChange}
          value={usernameValue}
        ></input>
      </div>
      <div className={styles.roomListWrapper}>
        <RoomsList hostedRooms={hostedRooms} roomClick={(id) => handleRoomJoin(false, id)} />
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={() => handleRoomJoin(true)} buttonText={TEXT_CONST.home.hostButton} type={BUTTON_TYPES.HOST} />
      </div>
    </div>
  );
}
