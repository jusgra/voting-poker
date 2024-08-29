import { v4 as uuidv4 } from "uuid";

export const expressRouting = (app) => {
  app.get("/create-room", (req, res) => {
    const roomId2 = uuidv4();
    const roomId = "123";
    res.redirect(`http://localhost:3000/room/${roomId}`);
  });
};
