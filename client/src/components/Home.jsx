import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import RoomsList from "./RoomsList";
import styles from "./Home.module.scss";
import Button from "./Button";
import { ButtonTypes } from "../ButtonTypes";
import { Text } from "./textConstants";

export default function Home({ socket }) {
  const [hostedRooms, setHostedRooms] = useState([]);
  const [usernameValue, setUsernameValue] = useState("");

  const navigator = useNavigate();

  const handleChange = (e) => {
    setUsernameValue(e.target.value);
  };

  const handleRoomJoin = (isHostingRoom, clickedRoomId) => {
    if (!usernameValue) {
      alert("Please input your name");
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
  }, []);

  return (
    <div>
      <div className={styles.usernameWrapper}>
        <input
          className={styles.usernameInput}
          placeholder={Text.Home.Placeholder}
          onChange={handleChange}
          value={usernameValue}
        ></input>
      </div>

      <div className={styles.roomListWrapper}>
        <RoomsList hostedRooms={hostedRooms} roomClick={handleRoomJoin} />
      </div>
      <div className={styles.buttonWrapper}>
        <Button onClick={() => handleRoomJoin(true)} buttonText={Text.Home.HostButton} type={ButtonTypes.HOST} />
      </div>
    </div>
  );
}
