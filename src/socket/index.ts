import { Socket } from "socket.io";
import {
  GameHistoryType,
  socketDisconnect,
} from "../controllers/GameController";

export let socket: Socket;

export const realTimeUpdate = async (gameHistory: GameHistoryType[]) => {
  socket.emit("all-bets", { gameHistory });
};

export default (io: any) => {
  io.on("connection", (socket: Socket) => {
    if (socket) {
      console.log("New User Connected : ", socket.id);
    }

    socket.on("disconnect", () => {
      socketDisconnect(socket.id);
      console.log("User Disconnected : ", socket.id);
    });
  });
  socket = io;
};
