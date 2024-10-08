import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUsername } from "./roomUtils";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import RoomsList from "./RoomsList";
import styles from "./Home.module.scss";

export default function Home({ socket }) {
  const [hostedRooms, setHostedRooms] = useState([]);

  const username = getUsername();

  const navigator = useNavigate();

  const handleClickJoin = (clickedRoomId) => {
    sessionStorage.setItem("isUserHost", false);
    socket.emit("ask-to-join", { roomId: clickedRoomId, isHosting: false });
  };

  const handleHost = () => {
    sessionStorage.setItem("isUserHost", true);

    socket.emit("ask-to-join", { roomId: uuidv4(), isHosting: true, username });
  };

  useEffect(() => {
    socket.on("join-allowed", (data) => {
      sessionStorage.setItem("username", username);
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

  console.log(hostedRooms);

  return (
    <div>
      <div>
        <p className={styles.usernameWrapper}>What is your name?</p>
        <input placeholder="username" value={username}></input>
      </div>

      <div>
        <RoomsList hostedRooms={hostedRooms} roomClick={handleClickJoin} />
      </div>
      <button onClick={handleHost}>HOST</button>
    </div>
  );
}
