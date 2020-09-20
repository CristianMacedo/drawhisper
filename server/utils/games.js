const Game = require("../classes/Game");

const games = [];

function setGame(io, room) {
  const game = new Game(io, room);
  games.push(game);
  return game;
}

function getGame(room) {
  return games.find((game) => game.room === room);
}

function deleteGame(room) {
  return games.splice(
    games.findIndex((game) => game.room === room),
    1
  )[0];
}

module.exports = {
  setGame,
  getGame,
  deleteGame,
};
