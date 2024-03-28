import routerx from "express-promise-router";
import {
  getHistory,
  betGame,
  getUserInfo,
  saveGameResult,
  saveSocketid,
} from "../controllers/GameController";

const router = routerx();

router.get("/get-history", getHistory);
router.post("/bet-game", betGame);
router.post("/get-userInfo", getUserInfo);
router.post("/save-game", saveGameResult);
router.post("/save-socketId", saveSocketid);

export default router;
