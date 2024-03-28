import routerx from "express-promise-router";
import Game from "./Game";

const router = routerx();
router.use("/game", Game);

export default router;
