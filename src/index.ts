import * as fs from "fs";
import * as cors from "cors";
import * as path from "path";
import socket from "./socket";
import * as express from "express";
import * as bodyParser from "body-parser";
import mongoose from "./config/mongoose";

import route from "./routes";
import { Start } from "./controllers/GameController";

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.use(cors("*" as cors.CorsOptions));

app.use("/api", route);
app.get("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));

const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });
mongoose();
socket(io);
app.set("io", io);
Start();
http.listen(port);
console.log("server listening on:", port);
