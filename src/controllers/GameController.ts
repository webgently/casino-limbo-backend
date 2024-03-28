import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BalanceModel, SocketModel } from "../models";
import { realTimeUpdate } from "../socket";

export interface GameHistoryType {
  userId: String;
  time: Date;
  betAmount: number;
  multiplier: number;
  payout: number;
  flag: boolean;
}

let GameHistory: GameHistoryType[] = [];

export const Start = () => {
  let interval: any;
  try {
    setInterval(() => {
      realTimeUpdate(GameHistory);
    }, 1000);
  } catch (error) {
    clearInterval(interval);
  }
};

export const getHistory = (req: any, res: any) => {
  try {
    res.json(GameHistory);
  } catch (err) {
    return res.json({ status: false });
  }
};

export const betGame = async (req: any, res: any) => {
  try {
    const { userId, betAmount, cashOut } = req.body;
    let multiplier = 1 / Math.random();
    let time = new Date();
    let payout = cashOut * betAmount;
    let flag: any = multiplier >= cashOut;
    GameHistory.unshift({
      userId,
      time,
      betAmount,
      multiplier: cashOut,
      payout,
      flag,
    });
    if (GameHistory.length > 15) {
      GameHistory.pop();
    }

    let orig_balance: any = await BalanceModel.findOne({ userId });
    orig_balance =
      orig_balance?.balance + betAmount * (flag ? cashOut - 1 : -1);
    await BalanceModel.updateOne({ userId, balance: orig_balance });

    const RecordOption = {
      method: "POST",
      url: "http://annie.ihk.vipnps.vip/iGaming/igaming/orders",
      headers: { "Content-Type": "application/json",gamecode:'Limbo' },
      data: {
        ptxid: uuidv4(),
        iGamingOrders: [
          {
            packageId: 4,
            userId,
            wonAmount: flag ? betAmount * cashOut : 0,
            betAmount: betAmount,
            odds: cashOut,
            status: flag ? 1 : 0,
            timestamp: new Date().getTime(),
          },
        ],
      },
    };

    axios
      .request(RecordOption)
      .then(function (response) {
      })
      .catch(function (error) {
        console.error(error);
      });

    res.json({
      userId,
      time,
      betAmount,
      multiplier,
      payout,
      flag,
    });
  } catch (error) {
    return res.json({ status: false });
  }
};

export const getUserInfo = async(req: any, res: any) => {
  let userId = uuidv4();
  let data = await BalanceModel.find({ userId: userId });
  if (data.length === 0) {
    await BalanceModel.insertMany({
          userId,
          balance: 5000,
        });
        res.json({
          userId,
          balance: 5000,
        });
  } else {
    res.json({
      userId,
      balance: data[0].balance,
    });
  }
};

export const saveGameResult = async (req: any, res: any) => {
  const refundApi = "http://annie.ihk.vipnps.vip/iGaming/igaming/credit";
  try {
    const { userId } = req.body;

    let balance = await BalanceModel.findOne({ userId: userId });
    const options = {
      method: "POST",
      url: refundApi,
      headers: {
        "Content-Type": "application/json",
        gamecode: "Limbo",
        packageId: "4",
      },
      data: {
        userId,
        balance: balance?.balance,
        ptxid: uuidv4(),
      },
    };
    axios
      .request(options)
      .then(async (data) => {
        await BalanceModel.updateMany({ userId: userId }, { balance: 0 });
        res.json({ status: "true" });
      })
      .catch((error) => {
        res.json({ status: "false" });
      });
  } catch (error) {
    res.json({ status: "false" });
  }
};

export const saveSocketid = async (req: any, res: any) => {
  try {
    const { userId, socketId } = req.body;
    let socketData = await SocketModel.find({ userId });
    if (socketData.length === 0) {
      await SocketModel.insertMany({ userId, socketId });
    } else {
      console.log(socketData.length);
      await SocketModel.updateOne({ userId: userId }, { socketId: socketId });
    }
    res.json({ status: "true" });
  } catch (error) {
    res.json({ status: "false" });
  }
};

export const socketDisconnect = async (socketId: String) => {
  const res: any = await SocketModel.findOne({ socketId });
  await SocketModel.deleteOne({ socketId });
};
