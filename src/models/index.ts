import { Schema, model } from "mongoose";

const balanceSchema = new Schema({
  userId: { type: String, require: true },
  balance: { type: Number, require: true },
});
export const BalanceModel = model("balances", balanceSchema);

const socketSchema = new Schema({
  userId: { type: String, require: true },
  socketId: { type: String, require: true },
});
export const SocketModel = model("socketIds", socketSchema);
