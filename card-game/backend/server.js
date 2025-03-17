const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("playCard", (data) => {
        io.emit("updateGame", data); // Send game update to all players
    });

    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => console.log("Server running on port 3001"));
