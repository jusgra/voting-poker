import { Server } from "socket.io";
import 'dotenv/config';

export const socketIoLogic = (server) => {
  const CLIENT_PORT = process.env?.CLIENT_PORT;
  const URL = process.env?.HOSTED_URL || process.env?.LOCAL_HOSTED_URL;

  const io = new Server(server, {
    cors: {
      origin: `${URL}:${CLIENT_PORT}`, //client side origin and port
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
      io.to(roomId).emit("update-room-data", await getRoomData(roomId));
    });

    socket.on("get-hosted-rooms", () => {
      io.to(socket.id).emit("update-room-list", hostedRooms);
    });

    socket.on("card-reveal-toggle", async ({ roomId }) => {
      for (const room of hostedRooms) {
        if (room.roomId === roomId) {
          if (room.areCardsRevealed) {
            room.areCardsRevealed = false;
            const sockets = await io.in(roomId).fetchSockets();
            for (const socket of sockets) socket.card = "";
          } else {
            room.areCardsRevealed = true;
          }
        }
      }

      io.to(roomId).emit("update-room-data", await getRoomData(roomId));
    });

    socket.on("check-room", async (roomId) => {
      if (hostedRooms.some((room) => room.roomId === roomId)) {
        io.to(socket.id).emit("check-room-response", { isAllowedToJoin: true });
        return;
      }
      io.to(socket.id).emit("check-room-response", { isAllowedToJoin: false });
    });

    socket.on("host-room", async ({ roomId, username }) => {
      hostedRooms.push({ roomId: roomId, hostId: socket.id, hostUsername: username, areCardsRevealed: false });
      io.emit("update-room-list", hostedRooms);
    });

    socket.on("join-room", async ({ roomId, username }) => {
      socket.join(roomId);
      socket.username = username;
      io.to(roomId).emit("update-room-data", await getRoomData(roomId));
      io.to(socket.id).emit("join-room-response", {
        isHosting: getIsUserHost(roomId, socket),
        roomData: await getRoomData(roomId),
      });
    });

    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      socket.card = "";
      io.to(roomId).emit("update-room-data", await getRoomData(roomId));
      updateHostedRoomsList(socket, roomId);
    });

    socket.on("leave-all-rooms", async () => {
      socket.card = "";
      await leaveAllRooms(socket);
      socket.join(socket.id);
    });

    socket.on("disconnecting", async () => {
      socket.card = "";
      socket.username = "";
      await leaveAllRooms(socket);
    });
  });

  const leaveAllRooms = async (socket) => {
    for (const roomId of socket.rooms) {
      socket.leave(roomId);
      io.to(roomId).emit("update-room-data", await getRoomData(roomId));
      updateHostedRoomsList(socket, roomId);
    }
  };

  const updateHostedRoomsList = (socket, roomId) => {
    if (hostedRooms.some((room) => room.hostId === socket.id)) {
      hostedRooms = hostedRooms.filter((single) => single.roomId !== roomId);
      io.emit("update-room-list", hostedRooms);
    }
  };

  const getRoomData = async (roomId) => {
    const userIds = io.sockets.adapter.rooms.get(roomId);
    if (!userIds) return null;

    const sockets = await io.in(roomId).fetchSockets();

    const usersInRoom = sockets.map((single) => {
      return { id: single.id, username: single.username, card: single.card };
    });

    const singleHostedRoom = hostedRooms.filter((single) => single.roomId === roomId);

    const returningRoomInfo = singleHostedRoom[0]
      ? singleHostedRoom[0]
      : { roomId: "", hostId: "", hostUsername: "", areCardsRevealed: false };

    return { roomInfo: returningRoomInfo, usersInRoom };
  };

  const getIsUserHost = (roomId, userSocket) => {
    const singleHostedRoom = hostedRooms.filter((single) => single.roomId === roomId);
    return singleHostedRoom[0].hostId === userSocket.id;

  };
};
