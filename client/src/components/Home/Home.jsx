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
    const roomId = isHostingRoom ? uuidv4() : clickedRoomId;

    socket.emit("ask-to-join", { roomId, isHosting: isHostingRoom, username: usernameValue });
  };

  useEffect(() => {
    socket.on("join-allowed", (data) => {
      sessionStorage.setItem("username", usernameValue);
      navigator(`/room/${data}`);
    });

    socket.on("error", (response) => {
      alert(response);
    });

    socket.on("room-created", (data) => {
      setHostedRooms(data);
    });

    return () => {
      socket.off("join-allowed");
      socket.off("error");
      socket.off("room-created");
    };
  });

  useEffect(() => {
    socket.emit("get-hosted-rooms");

    let timeoutId;

    if (location.state?.disconnected) {
      timeoutId = setTimeout(() => {
        toast.warning(textConst.home.toasts.hostLeft, toastSettings);
        navigator(".", { replace: true, state: { disconnected: false } });
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <ToastContainer className={styles.toastClass}/>
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
