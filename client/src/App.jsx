import io from "socket.io-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import Home from "./components/Rooms/Home/Home";
import Room from "./components/Rooms/Room";

const URL = import.meta.env?.PUBLIC_HOSTED_URL || import.meta.env?.PUBLIC_LOCAL_HOSTED_URL;
const SERVER_PORT = import.meta.env?.PUBLIC_SERVER_PORT;

const socket = io.connect(`${URL}:${SERVER_PORT}`); //server side URL and PORT


const App = () => {
  useEffect(() => {
    const handlePopState = () => {
      socket.emit("leave-all-rooms");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/room/:id" element={<Room socket={socket} />} />
      </Routes>
    </Router>
  );
};

export default App;
