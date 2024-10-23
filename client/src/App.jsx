import io from "socket.io-client";
import Home from "./components/Home/Home.jsx";
import Room from "./components/Room.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

const socket = io.connect("http://localhost:3001");

const App = () => {
  const [userId, setUserId] = useState("");

  socket.on("connect", () => {
    setUserId(socket.id);
  });

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
        <Route path="/" element={<Home socket={socket} userId={userId} />} />
        <Route path="/room/:id" element={<Room socket={socket} userId={userId} />} />
      </Routes>
    </Router>
  );
};

export default App;
