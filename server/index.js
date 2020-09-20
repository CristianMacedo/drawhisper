// Require dependencies
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// Require game
const { setGame, getGame, deleteGame } = require("./utils/games");

// Server setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setup IO handlers
// TODO: Find a way to keep IO as a global variable, to prevent passing it to each new game
io.on("connection", (socket) => {
  socket.on("joinGame", ({ username, room }) => {
    const game = getGame(room) || setGame(io, room);
    game.setPlayer(socket, username, "admin");
  });
});

server.listen(3000, () => {
  console.log(`[express] server listening on port 3000`);
});
