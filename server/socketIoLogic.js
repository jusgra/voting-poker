import { Server } from "socket.io";

export const socketIoLogic = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", //client side origin and port
    },
  });

  //socket.rooms - rooms of a socket
  //io.sockets.adapter.rooms - all rooms on the server
  //await io.in(roomId).fetchSockets(); - all sockets in room

  const hostedRooms = {};

  io.on("connection", (socket) => {
    console.log("-------------------");

    socket.on("card-pick", async ({ room, card }) => {
      socket.card = card;
      io.to(room).emit("card-show", await getUsersIds(room));
    });

    socket.on("ask-to-join", ({ roomId, isHosting }) => {
      if (isHosting) {
        io.to(socket.id).emit("join-allowed");
        hostedRooms[roomId] = socket.id;
        return;
      }
      if (hostedRooms[roomId]) {
        io.to(socket.id).emit("join-allowed");
        return;
      }

      io.to(socket.id).emit("error", "Room is not hosted");
    });

    socket.on("join-room", async ({ roomId, username }) => {
      socket.join(roomId);
      socket.username = username;

      io.to(roomId).emit("user-joined", {
        usersIdsInRoom: await getUsersIds(roomId),
      });
    });

    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      socket.card = "";
      io.to(roomId).emit("user-left", { leftUserId: socket.id, usersIdsInRoom: await getUsersIds(roomId) });
      if (hostedRooms[roomId] === socket.id) delete hostedRooms[roomId];
    });

    socket.on("disconnecting", async () => {
      for (const roomId of socket.rooms) {
        socket.leave(roomId);
        socket.card = "";
        io.to(roomId).emit("user-left", { leftUserId: socket.id, usersIdsInRoom: await getUsersIds(roomId) });
        if (hostedRooms[roomId] === socket.id) delete hostedRooms[roomId];
      }
    });
  });

  const getUsersIds = async (roomId) => {
    const userIds = io.sockets.adapter.rooms.get(roomId);
    if (!userIds) return null;

    const sockets = await io.in(roomId).fetchSockets();

    const usersArray = sockets.map((single) => {
      return { id: single.id, username: single.username, card: single.card };
    });

    return usersArray;
  };
};
