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

  let hostedRooms = [];
  // {
  //   roomId: string,
  //   hostId: string,
  //   hostUsername: string,
  //   areCardsRevealed: boolean
  // }

  io.on("connection", (socket) => {
    console.log("-------------------");
    console.log("user turnedOn with id - " + socket.id);

    socket.on("card-pick", async ({ roomId, pickedCard }) => {
      socket.card = pickedCard;

      io.to(roomId).emit("update-room-data", await getRoomUsersData(roomId));
    });

    socket.on("get-hosted-rooms", () => {
      io.to(socket.id).emit("room-created", hostedRooms);
    });

    socket.on("card-reveal-toggle", async ({ roomId, action }) => {
      for (const room of hostedRooms) {
        if (room.roomId === roomId) {
          if (room.areCardsRevealed) {
            room.areCardsRevealed = false;
            const sockets = await io.in(roomId).fetchSockets();
            for (const socket of sockets) {
              socket.card = "";
            }
          } else {
            room.areCardsRevealed = true;
          }
        }
      }

      io.to(roomId).emit("update-room-data", await getRoomUsersData(roomId));
    });

    socket.on("ask-to-join", ({ roomId, isHosting, username }) => {
      if (isHosting) {
        //user allowed to host
        io.to(socket.id).emit("join-allowed", roomId);
        hostedRooms.push({ roomId: roomId, hostId: socket.id, hostUsername: username, areCardsRevealed: false });
        io.emit("room-created", hostedRooms);
        return;
      }
      if (hostedRooms.some((room) => room.roomId === roomId)) {
        //user allowed to join hosted room
        io.to(socket.id).emit("join-allowed", roomId);
        return;
      }

      io.to(socket.id).emit("error", "Room is not hosted");
    });

    socket.on("join-room", async ({ roomId, username }) => {
      socket.join(roomId);
      socket.username = username;

      io.to(roomId).emit("update-room-data", await getRoomUsersData(roomId));
    });

    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      socket.card = "";
      io.to(roomId).emit("update-room-data", await getRoomUsersData(roomId));

      if (hostedRooms.some((room) => room.hostId === socket.id)) {
        hostedRooms = hostedRooms.filter((single) => single.roomId !== roomId);
        io.emit("room-created", hostedRooms);
      }
    });

    socket.on("disconnecting", async () => {
      socket.card = "";
      socket.username = "";
      for (const roomId of socket.rooms) {
        socket.leave(roomId);
        io.to(roomId).emit("update-room-data", await getRoomUsersData(roomId));
        if (hostedRooms.some((room) => room.hostId === socket.id)) {
          hostedRooms = hostedRooms.filter((single) => single.roomId !== roomId);
          io.emit("room-created", hostedRooms);
        }
      }
    });
  });

  const getRoomUsersData = async (roomId) => {
    const userIds = io.sockets.adapter.rooms.get(roomId);
    if (!userIds) return null;

    const sockets = await io.in(roomId).fetchSockets();

    const usersInRoom = sockets.map((single) => {
      return { id: single.id, username: single.username, card: single.card };
    });

    console.log(hostedRooms);

    const singleHostedRoom = hostedRooms.filter((single) => single.roomId === roomId);

    const returningRoomInfo = singleHostedRoom[0]
      ? singleHostedRoom[0]
      : { roomId: "", hostId: "", hostUsername: "", areCardsRevealed: false };

    return { roomInfo: returningRoomInfo, usersInRoom };
  };
};
