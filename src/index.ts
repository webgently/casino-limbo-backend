import * as cors from "cors";
import * as express from "express";
import mongoose from "./config/mongoose";
import socket from "./socket";

import { Start } from "./controllers/GameController";
import route from "./routes";

const port = process.env.PORT || 5000;

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend Load
app.use(express.static(__dirname + "/build"));
app.get("/*", function (req: any, res: any) {
    res.sendFile(__dirname + "/build/index.html", function (err: any) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

app.use("/api", route);

const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });
mongoose();
socket(io);
app.set("io", io);
Start();
http.listen(port);
console.log("server listening on:", port);
