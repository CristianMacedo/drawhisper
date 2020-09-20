const Book = require("./Book");

class Game {
  initialState = {
    event: "idle",
    timestamp: 0,
  };

  events = ["idle", "bootstrap", "draw", "guess", "presenting"];

  constructor(io, room) {
    console.log(`[drawhisper] [${room}] game created`);

    this.state = Object.assign({}, this.initialState);

    this.players = [];
    this.books = [];

    this.room = room;
    this.io = io;

    this.handleNewBook = this.handleNewBook.bind(this);
    // this.handleNewPage = this.handleNewPage.bind(this);
  }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
  }

  // TODO: Add user to players array
  // TODO: Add event handlers for the given socket
  // TODO: Emit players list to socket
  // TODO: Emit new player list to room
  // TODO: Handle disconnection
  setPlayer(socket, username, type) {
    console.log(`[drawhisper] [${this.room}] new player added - ${username}`);

    this.players.push({ id: socket.id, username, type });

    socket.join(this.room);

    socket.on("newBook", (payload) => this.handleNewBook(socket, payload));
    socket.on("newPage", (payload) => this.handleNewPage(socket, payload));
  }

  getPlayersId() {
    return this.players.map((player) => player.username);
  }

  getPlayer(id) {
    return this.players.find((player) => player.id === id);
  }

  deletePlayer(id) {
    return this.players.splice(
      this.players.findIndex((player) => player.id === id),
      1
    )[0];
  }

  // TODO: Update state event type according
  // TODO: Create round timer and verify if time has ended
  // TODO: Verify if player is admin
  handleNewBook(socket, { duration, firstAction }) {
    this.setState({ event: this.events[1] });
    this.books.push(new Book(this.getPlayersId(), socket.id));
  }

  // TODO: Verify amount of pages remaining for the round
  // TODO: Creating page sorting algorithm
  // handleNewPage(socket, { type, content }) {
  //   console.log(`[drawhisper] [${this.id}] new page received`);

  //   this.books[this.books.length - 1].newPage({ id: socket.id, type, content });
  // }
}

module.exports = Game;
